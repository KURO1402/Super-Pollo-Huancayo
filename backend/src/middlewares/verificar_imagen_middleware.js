const fs = require('fs');
const upload = require('../config/multer_config');

const verificarImagen = (req, res, next) => {
  upload.array('imagenProducto', 2)(req, res, function (err) {

    if (err) {

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (file && file.path) {
            try {
              fs.unlinkSync(file.path);
            } catch (unlinkError) {
              console.error('Error al borrar archivo inválido:', unlinkError.message);
            }
          }
        });
      } else if (req.file && req.file.path) {

        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error al borrar archivo inválido:', unlinkError.message);
        }
      }

      return res.status(400).json({ ok: false, message: err.message });
    }


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Se necesita la imagen en formato PNG O JPJ',
      });
    }

    if (req.files.length > 1) {
      req.files.forEach((file) => {
        if (file && file.path) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error al borrar archivo extra:', unlinkError.message);
          }
        }
      });

      return res.status(400).json({
        ok: false,
        message: 'Solo puedes subir una imagen a la vez',
      });
    }

    req.file = req.files[0];
    next();
  });
};

module.exports = verificarImagen;