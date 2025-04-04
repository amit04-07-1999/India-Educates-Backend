const multer = require('multer');
const path = require('path');
const fs = require('fs');

// File filter to check the allowed file types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|webp|svg|ico|json|txt|csv|json|xml|json5|json4|json3|json2|json1|json0|mp3|mp4|wav|ogg|webm|avi|mov|mkv|mpeg|mpg|m4a|aac|oga|ogg|wav|webm/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, DOC, DOCX, XLS, and XLSX files are allowed!'));
  }
};

const employeeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/employee';
    if (file.fieldname === 'resume') {
      uploadPath = './uploads/employee/resumes';
    } else if (file.fieldname === 'aadhaarCard') {
      uploadPath = './uploads/employee/aadhaar';
    } else if (file.fieldname === 'panCard') {
      uploadPath = './uploads/employee/pan';
    } else if (file.fieldname === 'qrCode') {
      uploadPath = './uploads/employee/qr';
    }
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const studentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/student';
    
    // Handle different types of student documents
    if (file.fieldname === 'studentImage') {
      uploadPath = './uploads/student/images';
    } else if (file.fieldname === 'studentIdImage') {
      uploadPath = './uploads/student/id-images';
    } else if (file.fieldname === 'qrCode') {
      uploadPath = './uploads/student/qr';
    } else if (file.fieldname === 'admissionDocs') {
      uploadPath = './uploads/student/admission';
    } else if (file.fieldname === 'scholarshipDocs') {
      uploadPath = './uploads/student/scholarship';
    } else if (file.fieldname === 'leaveApplicationDocs') {
      uploadPath = './uploads/student/leave';
    } else if (file.fieldname === 'certificateDocs') {
      uploadPath = './uploads/student/certificates';
    }
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const projectStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/project';
    if (file.fieldname === 'projectIcon') {
      uploadPath = './uploads/project/icons';
    }
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const taskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/task';
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const clientStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/client';
    
    // Handle different types of client documents
    if (file.fieldname === 'clientImage') {
      uploadPath = './uploads/client/profiles';
    } else if (file.fieldname === 'clientDL') {
      uploadPath = './uploads/client/driving-license';
    } else if (file.fieldname === 'clientPassport') {
      uploadPath = './uploads/client/passport';
    } else if (file.fieldname === 'clientAgentID') {
      uploadPath = './uploads/client/agent-id';
    } else if (file.fieldname === 'clientGovtID') {
      uploadPath = './uploads/client/govt-id';
    } else if (file.fieldname === 'qrCode') {
      uploadPath = './uploads/client/qr-codes';
    }
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const messageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/message';
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/profile';
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const invoiceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/invoice-logo';
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const chatStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/chat';
    if (file.fieldname === 'images') {
      uploadPath = './uploads/chat/images';
    } else if (file.fieldname === 'video') {
      uploadPath = './uploads/chat/videos';
    } else if (file.fieldname === 'audio' || file.fieldname === 'recording') {
      uploadPath = './uploads/chat/audio';
    } else if (file.fieldname === 'backgroundImage') {
      uploadPath = './uploads/chat/backgrounds';
    }
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const iccrStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/iccr';
    
    // Create a single folder for all ICCR files to simplify management
    uploadPath = './uploads/iccr/files';
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a short, unique filename
    const uniqueSuffix = Date.now().toString().slice(-6) + Math.round(Math.random() * 999);
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Remove spaces and special characters from original filename
    const sanitizedName = file.fieldname.replace(/[^a-zA-Z0-9]/g, '') + '-' + uniqueSuffix + ext;
    cb(null, sanitizedName);
  }
});

const uploadEmployee = multer({
  storage: employeeStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const studentMulter = multer({
  storage: studentStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadStudentAny = studentMulter.any();

const uploadStudent = studentMulter.fields([
  { name: 'studentImage', maxCount: 1 },
  { name: 'studentIdImage', maxCount: 1 },
  { name: 'qrCode', maxCount: 1 },
  { name: 'admissionDocs', maxCount: 5 },
  { name: 'scholarshipDocs', maxCount: 5 },
  { name: 'leaveApplicationDocs', maxCount: 5 },
  { name: 'certificateDocs', maxCount: 5 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);

const uploadStudentSingle = studentMulter.single('profileImage');

const uploadProject = multer({
  storage: projectStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
}).fields([
  { name: 'projectImage', maxCount: 10 }, // Allow multiple project images
  { name: 'projectIcon', maxCount: 1 }    // Allow one project icon
]);

const uploadTask = multer({
  storage: taskStorage,
  fileFilter: fileFilter, // Apply the file filter 
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadClient = multer({
  storage: clientStorage,
  fileFilter: fileFilter, 
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadMessage = multer({
  storage: messageStorage,
  fileFilter: fileFilter, // Apply the file filter 
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadInvoice = multer({
  storage: invoiceStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadChat = multer({
  storage: chatStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
}).fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'recording', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]);

const uploadICCR = multer({
  storage: iccrStorage,
  fileFilter: (req, file, cb) => {
    // Only allow certain file types
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG) and PDF files are allowed'));
    }
  },
  limits: { 
    fileSize: 1 * 1024 * 1024 // Reduce max file size to 1MB
  }
});

module.exports = { 
  uploadEmployee, 
  uploadStudent,
  uploadStudentSingle,
  uploadStudentAny,
  uploadProject, 
  uploadTask, 
  uploadClient, 
  uploadMessage, 
  uploadProfile, 
  uploadChat, 
  uploadInvoice,
  uploadICCR 
};
