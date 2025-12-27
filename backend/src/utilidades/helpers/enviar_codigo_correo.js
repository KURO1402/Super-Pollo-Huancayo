const transporter = require('../../config/nodemailer');

async function enviarCorreoVerificacion(correo, codigo) {

  const info = await transporter.sendMail({
    from: `'Super Pollo' <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Código de verificación 📨',
    html: `
      <div style='font-family: Arial, sans-serif; padding: 20px;'>
        <h2 style='color: #ff6600;'>¡Hola!</h2>
        <p>Tu código de verificación para <b>Super Pollo - Huancayo</b> es:</p>
        <h1 style='color: #333; letter-spacing: 4px;'>${codigo}</h1>
        <p>Este código expira en <b>5 minutos</b>.</p>
        <p style='font-size: 12px; color: #888;'>No compartas este código con nadie.</p>
      </div>
    `,
  });

  return info;
}

module.exports = enviarCorreoVerificacion;