const PDFDocument = require('pdfkit');
const path = require('path');

const { company, IGV} = require('../../utilidades/helpers/constantes_venta');
const numeroALetras = require('../../utilidades/numero_letras');

const ANCHO_PAGINA = 226.77;
const MARGEN = 8;
const ANCHO_UTIL = ANCHO_PAGINA - MARGEN * 2;


const generarPdfTermico = (datosComprobante, cliente, nombreTipoDoc, tituloComprobante) => {
    return new Promise((resolve, reject) => {
        try {
            const {
                serie, correlativo, fechaEmision, fecVencimiento,
                mtoOperGravadas, totalIgv, mtoImpVenta, details,
            } = datosComprobante;

            const ALTO_BASE = 420;
            const ALTO_POR_PRODUCTO = 16;
            const altoEstimado = ALTO_BASE + (details.length * ALTO_POR_PRODUCTO);

            const doc = new PDFDocument({
                size: [ANCHO_PAGINA, altoEstimado],
                margins: { top: MARGEN, bottom: MARGEN, left: MARGEN, right: MARGEN },
                autoFirstPage: true,
                bufferPages: false,
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const x = MARGEN;
            const xDer = ANCHO_PAGINA - MARGEN;
            const centrar = (texto, y, opts = {}) =>
                doc.text(texto, x, y, { width: ANCHO_UTIL, align: 'center', ...opts });
            const linea = (y, grosor = 0.5) =>
                doc.moveTo(x, y).lineTo(xDer, y).lineWidth(grosor).stroke();

            const formatearFecha = (iso) => {
                const d = new Date(iso);
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            };
            const formatearFechaHora = (iso) => {
                const d = new Date(iso);
                return `${formatearFecha(iso)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
            };

            let y = MARGEN;

            // Logo y empresa
            const logoPath = path.join(__dirname, '../../../public/super_pollo_logo.png');
            doc.image(logoPath, (ANCHO_PAGINA - 50) / 2, y, { width: 50, height: 50 });
            y += 55;

            doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a1a');
            centrar(company.nombreComercial, y);
            y += 12;

            doc.fontSize(6.5).font('Helvetica').fillColor('#333333');
            centrar(`RUC: ${company.ruc.toString()}`, y);
            y += 8;
            centrar(company.address?.direccion || '', y);
            y += 8;
            if (company.address?.provincia) {
                centrar(`${company.address.provincia} - ${company.address.departamento || ''}`, y);
                y += 8;
            }

            y += 2;
            linea(y, 1);
            y += 5;

            // Tipo y numero de comprobante
            doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000');
            centrar(tituloComprobante.toUpperCase(), y);
            y += 10;

            doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a1a1a');
            centrar(`${serie}-${String(correlativo).padStart(8, '0')}`, y);
            y += 10;

            doc.fontSize(6.5).font('Helvetica').fillColor('#666666');
            centrar(`Fecha: ${formatearFechaHora(fechaEmision)}`, y);
            y += 8;

            linea(y, 1);
            y += 6;

            // Datos cliente
            doc.fontSize(7).font('Helvetica').fillColor('#000000');
            const filaCliente = (label, valor) => {
                const labelWidth = 90;
                const valorWidth = ANCHO_UTIL - labelWidth;
                const alturaLabel = doc.heightOfString(label, { width: labelWidth });
                const alturaValor = doc.heightOfString(valor, { width: valorWidth });
                const altura = Math.max(alturaLabel, alturaValor);

                doc.font('Helvetica-Bold').fillColor('#333333').text(label, x, y, { width: labelWidth, lineBreak: false });
                doc.font('Helvetica').fillColor('#000000').text(valor, x + labelWidth, y, { width: valorWidth });
                y += altura + 2;
            };

            filaCliente(`${nombreTipoDoc.toUpperCase()}:`, cliente.numDoc);
            filaCliente('Cliente:', cliente.denominacionCliente);
            if (cliente.direccionCliente) filaCliente('Direccion:', cliente.direccionCliente);

            y += 3;
            linea(y);
            y += 5;

            // Encabezado tabla de productos
            const COL = {
                desc: { x: x, w: 80 },
                cant: { x: x + 80, w: 22 },
                pu: { x: x + 102, w: 36 },
                total: { x: x + 138, w: 64 },
            };

            doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#ffffff');
            doc.rect(x, y - 2, ANCHO_UTIL, 10).fill('#2c3e50');

            doc.fillColor('#ffffff').text('Descripcion', COL.desc.x + 2, y, { width: COL.desc.w - 4 });
            doc.text('Cant.', COL.cant.x, y, { width: COL.cant.w, align: 'center' });
            doc.text('P.Unit', COL.pu.x, y, { width: COL.pu.w, align: 'right' });
            doc.text('Total', COL.total.x, y, { width: COL.total.w, align: 'right' });

            y += 10;
            linea(y, 0.5);
            y += 4;

            // Filas productos
            doc.fontSize(6.5).font('Helvetica').fillColor('#000000');
            let filaAlternada = false;
            for (const d of details) {
                if (filaAlternada) {
                    doc.rect(x, y - 2, ANCHO_UTIL, 12).fill('#f5f5f5');
                }
                filaAlternada = !filaAlternada;

                const alturaFila = Math.max(doc.heightOfString(d.descripcion, { width: COL.desc.w - 4 }), 9);
                doc.fillColor('#000000').text(d.descripcion, COL.desc.x + 2, y, { width: COL.desc.w - 4 });
                doc.text(String(d.cantidad), COL.cant.x, y, { width: COL.cant.w, align: 'center' });
                doc.text(`S/ ${d.mtoPrecioUnitario.toFixed(2)}`, COL.pu.x, y, { width: COL.pu.w, align: 'right' });
                doc.text(`S/ ${(d.mtoValorVenta + d.igv).toFixed(2)}`, COL.total.x, y, { width: COL.total.w, align: 'right' });
                y += alturaFila + 3;
            }

            y += 2;
            linea(y, 1);
            y += 6;

            // Totales
            doc.fontSize(7).font('Helvetica').fillColor('#000000');
            const filaTotales = (label, valor, negrita = false) => {
                const ancho = ANCHO_UTIL - 60;
                if (negrita) {
                    doc.rect(x, y - 2, ANCHO_UTIL, 10).fill('#ecf0f1');
                    doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a1a1a');
                } else {
                    doc.font('Helvetica').fillColor('#333333');
                }
                doc.text(label, x + 5, y, { width: ancho });
                doc.fillColor('#000000').text(`S/ ${valor}`, x, y, { width: ANCHO_UTIL - 5, align: 'right' });
                y += 10;
            };

            filaTotales('Op. Gravadas:', mtoOperGravadas.toFixed(2));
            filaTotales(`IGV (${(IGV * 100).toFixed(0)}%):`, totalIgv.toFixed(2));
            filaTotales('TOTAL:', mtoImpVenta.toFixed(2), true);

            y += 3;
            linea(y, 1);
            y += 6;

            // Importe en letras
            const enLetras = `SON: ${numeroALetras(mtoImpVenta)}`;
            doc.fontSize(6.5).font('Helvetica-BoldOblique').fillColor('#333333');
            centrar(enLetras, y, { lineBreak: true });
            y += doc.heightOfString(enLetras, { width: ANCHO_UTIL }) + 4;

            linea(y, 0.5);
            y += 8;

            // Pie
            doc.fontSize(6).font('Helvetica').fillColor('#666666');
            if (tituloComprobante.toLowerCase() === 'nota de venta') {
                centrar('Documento no valido para credito fiscal', y);
                y += 9;
            }
            centrar('Gracias por su preferencia!', y);

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = generarPdfTermico;