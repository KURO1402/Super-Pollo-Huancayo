const transporter = require('../../config/nodemailer');

const enviarCorreoReservacion = async (datos) => {
    const { codigoReservacion, fecha, hora, cantidadPersonas, mesasConInfo, correo } = datos;
    const filaMesas = mesasConInfo.map(m => `
        <tr>
            <td style='padding: 10px 16px; border-bottom: 1px solid #e0e0e0; color: #444;'>
                <span style='margin-right: 10px;'>🪑</span> Mesa ${m.numeroMesa}
            </td>
        </tr>
    `).join('');

    const info = await transporter.sendMail({
        from: `'Super Pollo' <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: 'Confirmación de reservación 🍗',
        html: `
            <div style='font-family: "Helvetica", Arial, sans-serif; padding: 25px; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);'>
                <h2 style='color: #e65c00; margin-top: 0; font-weight: 500; border-left: 4px solid #e65c00; padding-left: 15px;'>¡Reservación confirmada!</h2>
                <p style='color: #555; line-height: 1.5;'>Gracias por reservar en <b style='color: #333;'>Super Pollo - Huancayo</b>. Aquí están los detalles:</p>

                <div style='background: #faf7f2; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #ffeed9;'>
                    <p style='margin: 8px 0; color: #444;'><span style='display: inline-block; width: 80px;'>📅 Fecha:</span> <b>${fecha}</b></p>
                    <p style='margin: 8px 0; color: #444;'><span style='display: inline-block; width: 80px;'>🕐 Hora:</span> <b>${hora}</b></p>
                    <p style='margin: 8px 0; color: #444;'><span style='display: inline-block; width: 80px;'>👥 Personas:</span> <b>${cantidadPersonas}</b></p>
                </div>

                <p style='color: #444; margin-bottom: 8px;'><b>Mesas reservadas:</b></p>
                <table style='width: 100%; border-collapse: collapse; background: #faf7f2; border-radius: 10px; overflow: hidden; border: 1px solid #ffeed9;'>
                    ${filaMesas}
                </table>

                <div style='text-align: center; margin: 25px 0 15px;'>
                    <p style='color: #666; margin-bottom: 8px;'>Tu código de reservación es:</p>
                    <div style='background: #fff3e0; padding: 12px; border-radius: 50px; display: inline-block; border: 1px dashed #e65c00;'>
                        <span style='color: #e65c00; font-size: 24px; font-weight: bold; letter-spacing: 4px;'>${codigoReservacion}</span>
                    </div>
                    <p style='color: #777; font-size: 14px; margin-top: 12px;'>Presenta este código al llegar al local</p>
                </div>

                <p style='font-size: 13px; color: #999; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; text-align: center;'>
                    📞 ¿Dudas? Contáctanos al 123-456-789
                </p>
            </div>
        `
    });

    return info;
};
module.exports = enviarCorreoReservacion;