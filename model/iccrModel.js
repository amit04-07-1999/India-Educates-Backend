const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iccrSchema = new Schema({
    // Personal Information
    fullName: { type: String },
    studentPhoto: { type: String, maxlength: 255 }, // URL/path to uploaded photo
    dateOfBirth: { type: Date },
    gender: { type: String, maxlength: 10 },
    placeOfBirth: { type: String, maxlength: 100 },
    mobileNumber: { type: String, maxlength: 20 },
    whatsappNumber: { type: String, maxlength: 20 },
    email: { type: String, maxlength: 100 },

    // Passport Details
    passport: { type: String, maxlength: 50 },
    passportCountry: { type: String, maxlength: 50 },
    passportIssueDate: { type: Date },
    passportExpiryDate: { type: Date },

    // Address Information
    addressLine: { type: String, maxlength: 255 },
    city: { type: String, maxlength: 100 },
    state: { type: String, maxlength: 100 },
    addressCountry: { type: String, maxlength: 50 },
    zipcode: { type: String, maxlength: 20 },

    // Parent Information
    fatherName: { type: String, maxlength: 100 },
    fatherPhone: { type: String, maxlength: 20 },
    fatherEmail: { type: String, maxlength: 100 },
    motherName: { type: String, maxlength: 100 },
    motherPhone: { type: String, maxlength: 20 },
    motherEmail: { type: String, maxlength: 100 },

    
    //Course Information
    academicYear: { type: String, maxlength: 20 },
    levelOfCourse: { type: String, maxlength: 50 }, // UG/PG
    courseMainStream: { type: String, maxlength: 50 }, // Science/Commerce/Arts

    //University Preferences
    universityPreferences: [{
        preference: { type: Number },
        university: { type: String, maxlength: 100 },
        course: { type: String, maxlength: 100 },
        subject: { type: String, maxlength: 100 },
    }],

    // Additional Information
    travelledInIndia: { type: String, maxlength: 5 },
    residenceInIndia: { type: String, maxlength: 5 },
    marriedToIndian: { type: String, maxlength: 5 },
    internationalDrivingLicence: { type: String, maxlength: 5 },
    otherInformation: { type: String, maxlength: 500 },
    dateOfApplication: { type: Date },
    placeOfApplication: { type: String, maxlength: 100 },
    signature: { type: String, maxlength: 255 },//File path

    // Required Documents - Store only file paths with maximum length
    permanentUniqueId: { type: String, maxlength: 255 }, // File path
    passportCopy: { type: String, maxlength: 255 }, // File path
    gradeXMarksheet: { type: String, maxlength: 255 }, // File path
    gradeXIIMarksheet: { type: String, maxlength: 255 }, // File path
    medicalFitnessCertificate: { type: String, maxlength: 255 }, // File path
    englishTranslationOfDocuments: { type: String, maxlength: 255 }, // File path
    englishAsSubjectDocument: { type: String, maxlength: 255 }, // File path
    anyOtherDocument: { type: String, maxlength: 255 }, // File path

    // Application Status
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
        default: 'Pending'
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { strict: true }); // Enforce schema strictness

const iccrForm1Schema = new Schema({
    // Personal Information
    fullName: { type: String, maxlength: 100 },
    countryCode: { type: String, maxlength: 10 },
    mobileNumber: { type: String, maxlength: 20 },
    email: { type: String, maxlength: 100 },
    dateOfBirth: { type: Date },
    gender: { type: String, maxlength: 10 },
    lastQualification: { type: String, maxlength: 100 },
    course: { type: String, maxlength: 100 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { strict: true }); // Enforce schema strictness

// Set collection options
iccrSchema.set('collection', 'iccrs');
iccrForm1Schema.set('collection', 'iccrform1s');

const ICCR = mongoose.model("ICCR", iccrSchema);
const ICCRForm1 = mongoose.model("ICCRForm1", iccrForm1Schema);

module.exports = { ICCR, ICCRForm1 };
