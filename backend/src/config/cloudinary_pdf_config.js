require('dotenv').config();
const cloudinaryPdf = require('cloudinary').v2;

cloudinaryPdf.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_PDF_NAME,
  api_key: process.env.CLOUDINARY_API_PDF_KEY,
  api_secret: process.env.CLOUDINARY_API_PDF_SECRET
});

module.exports = cloudinaryPdf;