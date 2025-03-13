const express = require('express');
const router = express.Router();
const Student = require('../model/studentModel');
const { uploadStudent, uploadStudentAny } = require('../utils/multerConfig');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

// Total Students
router.get('/totalStudents', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        res.json({ totalStudents });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new student
router.post('/students', uploadStudent, async (req, res) => {
    try {
        const files = req.files;
        const studentData = req.body;

        // Handle studentImage
        if (files?.studentImage) {
            studentData.studentImage = files.studentImage[0].path
                .replace(/\\/g, '/')
                .replace('uploads/', '');
        }

        // Handle studentIdImage
        if (files?.studentIdImage) {
            studentData.studentIdImage = files.studentIdImage[0].path
                .replace(/\\/g, '/')
                .replace('uploads/', '');
        }

        // Handle bank details
        studentData.bankDetails = {
            bankName: studentData.bankName || '',
            accountHolderName: studentData.accountHolderName || '',
            accountNumber: studentData.accountNumber || '',
            ifscCode: studentData.ifscCode || '',
            accountType: studentData.accountType || '',
            upiId: studentData.upiId || '',
            paymentApp: studentData.paymentApp || ''
        };

        if (files.qrCode) {
            studentData.bankDetails.qrCode = files.qrCode[0].path
                .replace(/\\/g, '/')
                .replace('uploads/', '');
        }

        // Clean up individual fields
        delete studentData.bankName;
        delete studentData.accountHolderName;
        delete studentData.accountNumber;
        delete studentData.ifscCode;
        delete studentData.accountType;
        delete studentData.upiId;
        delete studentData.paymentApp;

        const student = new Student(studentData);
        const savedStudent = await student.save();
        sendEmail(savedStudent);
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Student login
router.post("/studentlogin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    try {
        const studentDetails = await Student.findOne({
            emailid: email,
            password: password
        }).lean();

        if (!studentDetails) {
            return res.status(400).json({
                message: "User not found or invalid credentials"
            });
        }

        const token = jwt.sign({ _id: studentDetails._id }, process.env.JWT_SECRET);

        return res.status(200).json({
            status: 200,
            message: "Login success",
            user: studentDetails,
            token: token
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Email sending function
async function sendEmail(student) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: student.emailid,
        subject: 'Your Student Account Details',
        html: `
            <h1>Hello ${student.studentName},</h1>
            <p>Welcome! Your student account has been created. Here are your login details:</p>
            <ul>
                <li><strong>Email:</strong> ${student.emailid}</li>
                <li><strong>Password:</strong> ${student.password}</li>
            </ul>
            <p><a href="https://yourwebsite.com/student-signin">Click here to login</a></p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you!</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`Email sent to ${student.emailid}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Add this GET route to fetch all students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a student
router.put('/students/:id', uploadStudentAny, async (req, res) => {
    try {
        const files = req.files;
        const studentData = req.body;

        // Handle file uploads if present
        if (files && files.length > 0) {
            // Group files by fieldname
            const filesByField = {};
            files.forEach(file => {
                if (!filesByField[file.fieldname]) {
                    filesByField[file.fieldname] = [];
                }
                filesByField[file.fieldname].push(file);
            });

            // Handle studentImage - take only the first file
            if (filesByField.studentImage && filesByField.studentImage.length > 0) {
                studentData.studentImage = filesByField.studentImage[0].path
                    .replace(/\\/g, '/')
                    .replace('uploads/', '');
            }

            // Handle studentIdImage - take only the first file
            if (filesByField.studentIdImage && filesByField.studentIdImage.length > 0) {
                studentData.studentIdImage = filesByField.studentIdImage[0].path
                    .replace(/\\/g, '/')
                    .replace('uploads/', '');
            }

            // Handle qrCode - take only the first file
            if (filesByField.qrCode && filesByField.qrCode.length > 0) {
                studentData.bankDetails = studentData.bankDetails || {};
                studentData.bankDetails.qrCode = filesByField.qrCode[0].path
                    .replace(/\\/g, '/')
                    .replace('uploads/', '');
            }
        }

        // Handle loans data if it exists
        if (studentData.loans) {
            try {
                // If loans is already an object, keep it as is
                // If it's a string, try to parse it
                if (typeof studentData.loans === 'string') {
                    // Only try to parse if it looks like JSON
                    if (studentData.loans.startsWith('{') || studentData.loans.startsWith('[')) {
                        studentData.loans = JSON.parse(studentData.loans);
                    } else {
                        // If it's not valid JSON, remove it
                        delete studentData.loans;
                    }
                }
            } catch (error) {
                console.error('Error parsing loans data:', error);
                // If parsing fails, remove the loans field to prevent errors
                delete studentData.loans;
            }
        }

        // Handle bank details
        if (studentData.bankName || studentData.accountHolderName || studentData.accountNumber || 
            studentData.ifscCode || studentData.accountType || studentData.upiId || studentData.paymentApp) {
            studentData.bankDetails = {
                ...studentData.bankDetails,
                bankName: studentData.bankName || '',
                accountHolderName: studentData.accountHolderName || '',
                accountNumber: studentData.accountNumber || '',
                ifscCode: studentData.ifscCode || '',
                accountType: studentData.accountType || '',
                upiId: studentData.upiId || '',
                paymentApp: studentData.paymentApp || ''
            };

            // Clean up individual fields
            delete studentData.bankName;
            delete studentData.accountHolderName;
            delete studentData.accountNumber;
            delete studentData.ifscCode;
            delete studentData.accountType;
            delete studentData.upiId;
            delete studentData.paymentApp;
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: studentData },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (err) {
        console.error('Update error:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Return success message
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add this new endpoint for student profile
router.get('/student/profile', async (req, res) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];

        // Verify the token and get the student ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded._id;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Return the student data
        res.json(student);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add this new route to get a single student by ID
router.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        res.json(student);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 