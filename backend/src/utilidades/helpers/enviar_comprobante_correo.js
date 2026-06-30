require('dotenv').config();
const resend = require('../../config/resend');

const enviarComprobanteCorreo = async (correo_cliente, url_comprobante_pdf) => {
    const { data, error } = await resend.emails.send({
        from: `Super Pollo <${process.env.EMAIL_FROM || 'notificaciones@superpollohyo.com'}>`,
        to: correo_cliente,
        subject: 'Tu comprobante de pago electrónico 🍗',
        html: `
            <div style='font-family: "Helvetica", Arial, sans-serif; padding: 25px; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);'>
                <h2 style='color: #e65c00; margin-top: 0; font-weight: 500; border-left: 4px solid #e65c00; padding-left: 15px;'>¡Gracias por tu compra!</h2>
                <p style='color: #555; line-height: 1.5;'>Tu comprobante electrónico ha sido emitido correctamente. Puedes visualizarlo y descargarlo haciendo clic en el siguiente enlace:</p>

                <div style='text-align: center; margin: 30px 0 15px;'>
                    <a href='${url_comprobante_pdf}' target='_blank' style='background: #e65c00; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;'>
                        📄 Ver comprobante
                    </a>
                </div>

                <p style='font-size: 13px; color: #999; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; text-align: center;'>
                    📞 ¿Dudas? Contáctanos al 947932022
                </p>
            </div>
        `
    });

    if (error) {
        console.error("Error enviando comprobante:", error);
        throw new Error(error.message);
    }

    return data;
};

module.exports = enviarComprobanteCorreo;