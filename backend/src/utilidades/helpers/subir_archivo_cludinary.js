const cloudinaryPdf = require('../../config/cloudinary_pdf_config');

const subirArchivoCloudinary = (buffer, nombreArchivo, formato) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinaryPdf.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder:        'comprobantes',
                public_id:     nombreArchivo,
                format:        formato,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

module.exports = subirArchivoCloudinary;