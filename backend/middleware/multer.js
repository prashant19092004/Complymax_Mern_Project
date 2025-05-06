// config/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save in the uploads folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename while preserving the original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

// File filter for PDFs only
const pdfFilter = (req, file, cb) => {
  // Check both the file extension and MIME type
  const isPDF = file.mimetype === 'application/pdf' || 
                path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPDF) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed!'));
  }
};

// File filter for both images and PDFs
const imageAndPdfFilter = (req, file, cb) => {
  // Check for images
  const imageTypes = /jpeg|jpg|png/;
  const isImage = imageTypes.test(path.extname(file.originalname).toLowerCase()) && 
                 imageTypes.test(file.mimetype);

  // Check for PDFs
  const isPDF = file.mimetype === 'application/pdf' || 
                path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isImage || isPDF) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'));
  }
};

// Initialize multer for images
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: imageFilter
});

// Initialize multer for PDFs
const uploadPDF = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB for PDFs
  fileFilter: pdfFilter
});

// Initialize multer for both images and PDFs
const uploadImageAndPdf = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB
  fileFilter: imageAndPdfFilter
});

module.exports = { uploadImage, uploadPDF, uploadImageAndPdf };
