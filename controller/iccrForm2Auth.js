const express = require('express');
const router = express.Router();
const { ICCR } = require('../model/iccrModel');
const { uploadICCR } = require('../utils/multerConfig');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

// Create ICCR application
router.post('/iccr', uploadICCR.fields([
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'permanentUniqueId', maxCount: 1 },
    { name: 'passportCopy', maxCount: 1 },
    { name: 'gradeXMarksheet', maxCount: 1 },
    { name: 'gradeXIIMarksheet', maxCount: 1 },
    { name: 'medicalFitnessCertificate', maxCount: 1 },
    { name: 'englishTranslationOfDocuments', maxCount: 1 },
    { name: 'englishAsSubjectDocument', maxCount: 1 },
    { name: 'anyOtherDocument', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]), async (req, res) => {
    try {
        const applicationData = {};  // Create a new empty object instead of using req.body directly

        // Only add the fields we explicitly need
        const textFields = [
            'fullName', 'gender', 'placeOfBirth', 'mobileNumber', 'whatsappNumber', 'email',
            'passport', 'passportCountry', 'city', 'state', 'addressCountry', 'zipcode',
            'fatherName', 'fatherPhone', 'fatherEmail', 'motherName', 'motherPhone', 'motherEmail',
            'academicYear', 'levelOfCourse', 'courseMainStream', 'addressLine',
            'travelledInIndia', 'residenceInIndia', 'marriedToIndian', 'internationalDrivingLicence',
            'otherInformation', 'placeOfApplication'
        ];

        // Add text fields from req.body to applicationData
        textFields.forEach(field => {
            if (req.body[field]) {
                applicationData[field] = req.body[field].toString().substring(0, 500); // Limit string length
            }
        });

        // Parse date fields
        const dateFields = ['dateOfBirth', 'passportIssueDate', 'passportExpiryDate', 'dateOfApplication'];
        dateFields.forEach(field => {
            if (req.body[field]) {
                try {
                    applicationData[field] = new Date(req.body[field]);
                } catch (e) {
                    console.error(`Error parsing date for field ${field}: ${e.message}`);
                }
            }
        });

        // Handle university preferences separately
        if (req.body['universityPreferences[0][university]']) {
            applicationData.universityPreferences = [];
            
            // Determine how many preferences were submitted
            let preferenceCount = 0;
            while (req.body[`universityPreferences[${preferenceCount}][university]`]) {
                preferenceCount++;
            }
            
            // Process each preference
            for (let i = 0; i < preferenceCount; i++) {
                const preference = {
                    preference: i + 1,
                    university: (req.body[`universityPreferences[${i}][university]`] || '').substring(0, 100),
                    course: (req.body[`universityPreferences[${i}][course]`] || '').substring(0, 100),
                    subject: (req.body[`universityPreferences[${i}][subject]`] || '').substring(0, 100)
                };
                applicationData.universityPreferences.push(preference);
            }
        }

        // Handle file uploads - store only file paths instead of actual files
        if (req.files) {
            const fileFields = [
                'studentPhoto', 'signature', 'permanentUniqueId', 'passportCopy', 
                'gradeXMarksheet', 'gradeXIIMarksheet', 'medicalFitnessCertificate', 
                'englishTranslationOfDocuments', 'englishAsSubjectDocument', 'anyOtherDocument'
            ];
            
            fileFields.forEach(field => {
                if (req.files[field] && req.files[field][0]) {
                    // Store only the relative path, not the full file data
                    applicationData[field] = req.files[field][0].path.replace(/\\/g, '/');
                }
            });
        }

        // Set default status
        applicationData.status = 'Pending';

        // Create new application with only necessary data
        const newApplication = new ICCR(applicationData);
        await newApplication.save();

        // Clean up old data occasionally (every 10th submission)
        if (Math.random() < 0.1) {  // 10% chance to perform cleanup
            try {
                // Get count of total documents
                const count = await ICCR.countDocuments();
                if (count > 50) { // If we have more than 50 documents
                    // Find older documents to remove
                    const oldestDocs = await ICCR.find({})
                        .sort({ createdAt: 1 }) // Sort by oldest first
                        .limit(Math.floor(count / 10)); // Remove 10% of oldest docs
                        
                    // Delete these documents
                    for (const doc of oldestDocs) {
                        await ICCR.findByIdAndDelete(doc._id);
                    }
                    console.log(`Cleaned up ${oldestDocs.length} old ICCR documents`);
                }
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
                // Don't throw error, this is just maintenance
            }
        }

        // Response to client - only send minimal data back
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                id: newApplication._id,
                name: newApplication.fullName,
                email: newApplication.email,
                status: newApplication.status
            }
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
});

// Get all ICCR applications
router.get('/iccr', async (req, res) => {
    try {
        const applications = await ICCR.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// Get single ICCR application
router.get('/iccr/:id', async (req, res) => {
    try {
        const application = await ICCR.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
});

module.exports = router;


