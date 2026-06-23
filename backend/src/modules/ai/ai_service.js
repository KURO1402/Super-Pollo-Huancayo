// modules/ai/ai_service.js
const { GoogleGenAI } = require('@google/genai');
const db = require('./ai_model');
const { ALL_TOOLS } = require('./tools/index');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODELO = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `
Eres el asistente de IA de Super Pollo HYO, un restaurante peruano.
Ayudas al personal administrativo con consultas sobre ventas, caja, inventario y reservas.

FECHA ACTUAL: ${new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

REGLAS:
- Responde siempre en español, de forma clara y directa.
- Cuando el usuario pida un gráfico, usa la tool generarGrafico. No describas los datos como texto, solo confirma que el gráfico fue generado.
- Cuando el usuario pida reportes, por ahora di que no esta disponible y que estara mas adelante
- Para montos usa el formato S/. con 2 decimales.
- Si no tienes datos suficientes para responder, dilo claramente.
- No inventes datos. Solo usa lo que retornan las tools.
- Si el usuario dice "hoy" calcula la fecha actual. "esta semana" = lunes a hoy. "este mes" = 1ro del mes a hoy.
`.trim();

async function construirGrafico({ tipo_grafico, fecha_inicio, fecha_fin, limite }) {
    const COLORES = ['#4F8EF7', '#34C27B', '#F7C948', '#E2534A', '#A78BFA'];

    switch (tipo_grafico) {
        case 'ventas_diarias': {
            const data = await db.obtenerDetalleVentas(fecha_inicio, fecha_fin);
            const porFecha = {};
            data.forEach(r => {
                const f = r.fecha;
                if (!porFecha[f]) porFecha[f] = { fecha: f, total: 0, cantidad: 0 };
                porFecha[f].total += parseFloat(r.total_venta ?? 0);
                porFecha[f].cantidad += 1;
            });
            return {
                __tipo: 'grafico',
                tipo: 'LineChart',
                titulo: `Ventas diarias ${fecha_inicio} → ${fecha_fin}`,
                data: Object.values(porFecha).sort((a, b) => a.fecha.localeCompare(b.fecha)),
                lineas: [
                    { clave: 'total', nombre: 'Total (S/.)', color: '#4F8EF7' },
                    { clave: 'cantidad', nombre: 'Nº ventas', color: '#34C27B' },
                ],
                ejeX: 'fecha',
            };
        }

        case 'top_productos': {
            const data = await db.obtenerTopProductosVendidos(fecha_inicio, fecha_fin);
            const top = (limite ?? 10);
            return {
                __tipo: 'grafico',
                tipo: 'BarChart',
                titulo: `Top ${top} productos más vendidos`,
                data: data.slice(0, top).map(r => ({
                    nombre: r.nombre_producto,
                    unidades: r.unidades_vendidas,
                    total: parseFloat(r.total_generado),
                })),
                barras: [{ clave: 'unidades', nombre: 'Unidades', color: '#4F8EF7' }],
                ejeX: 'nombre',
            };
        }

        case 'medios_pago': {
            const data = await db.obtenerResumenVentas(fecha_inicio, fecha_fin);
            return {
                __tipo: 'grafico',
                tipo: 'PieChart',
                titulo: 'Distribución por medio de pago',
                data: data
                    .filter(r => r.nombre_medio_pago)
                    .map((r, i) => ({
                        name: r.nombre_medio_pago,
                        value: parseFloat(r.monto_total ?? 0),
                        fill: COLORES[i % COLORES.length],
                    })),
            };
        }

        case 'stock_insumos': {
            const data = await db.obtenerEstadoInventario(null);
            return {
                __tipo: 'grafico',
                tipo: 'BarChart',
                titulo: 'Stock actual de insumos',
                layout: 'vertical',
                data: data.map(r => ({
                    nombre: `${r.nombre_insumo} (${r.unidad_medida})`,
                    stock: parseFloat(r.stock_insumo),
                    nivel: r.nivel_stock,
                    fill: r.nivel_stock === 'critico' ? '#E2534A'
                        : r.nivel_stock === 'bajo' ? '#F7C948'
                            : '#34C27B',
                })),
                barras: [{ clave: 'stock', nombre: 'Stock', colorPorDato: true }],
                ejeX: 'stock',
                ejeY: 'nombre',
            };
        }

        case 'reservas_diarias': {
            const data = await db.obtenerDetalleReservas(fecha_inicio, fecha_fin, null);
            const porFecha = {};
            data.forEach(r => {
                const f = r.fecha_reservacion;
                if (!porFecha[f]) porFecha[f] = { fecha: f, completadas: 0, pendientes: 0, canceladas: 0 };
                porFecha[f][r.estado_reservacion] = (porFecha[f][r.estado_reservacion] ?? 0) + 1;
            });
            return {
                __tipo: 'grafico',
                tipo: 'BarChart',
                titulo: `Reservas ${fecha_inicio} → ${fecha_fin}`,
                apilado: true,
                data: Object.values(porFecha).sort((a, b) => a.fecha.localeCompare(b.fecha)),
                barras: [
                    { clave: 'completadas', nombre: 'Completadas', color: '#34C27B' },
                    { clave: 'pendientes', nombre: 'Pendientes', color: '#F7C948' },
                    { clave: 'canceladas', nombre: 'Canceladas', color: '#E2534A' },
                ],
                ejeX: 'fecha',
            };
        }

        default:
            return { error: 'Tipo de gráfico no reconocido.' };
    }
}

async function ejecutarTool(nombre, args) {
    switch (nombre) {
        case 'consultarVentas':
            return args.tipo === 'resumen'
                ? db.obtenerResumenVentas(args.fecha_inicio, args.fecha_fin)
                : db.obtenerDetalleVentas(args.fecha_inicio, args.fecha_fin);
        case 'consultarTopProductos':
            return db.obtenerTopProductosVendidos(args.fecha_inicio, args.fecha_fin);
        case 'consultarProductos':
            return db.obtenerCatalogoProductos(args.id_categoria ?? null, args.nombre ?? null);
        case 'consultarProductosConInsumos':
            return db.obtenerProductosConInsumos(args.id_producto ?? null);
        case 'consultarCaja':
            if (args.tipo === 'resumen') return db.obtenerResumenCaja(args.fecha_inicio, args.fecha_fin);
            if (args.tipo === 'movimientos') return db.obtenerMovimientosCaja(args.fecha_inicio, args.fecha_fin, args.tipo_movimiento ?? null);
            if (args.tipo === 'arqueos') return db.obtenerArqueosCaja(args.fecha_inicio, args.fecha_fin);
            break;
        case 'consultarInventario':
            if (args.tipo === 'estado') return db.obtenerEstadoInventario(args.nivel_stock ?? null);
            if (args.tipo === 'movimientos') return db.obtenerMovimientosInventario(args.fecha_inicio, args.fecha_fin, args.id_insumo ?? null);
            break;
        case 'consultarReservas':
            return args.tipo === 'resumen'
                ? db.obtenerResumenReservas(args.fecha_inicio, args.fecha_fin)
                : db.obtenerDetalleReservas(args.fecha_inicio, args.fecha_fin, args.estado ?? null);
        case 'generarGrafico':
            return construirGrafico(args);
        default:
            return { error: `Tool "${nombre}" no reconocida.` };
    }
}

async function procesarMensaje(mensaje, historial = [], onChunk = null) {
    // Instanciar el chat usando la API moderna de @google/genai
    const chat = genAI.chats.create({
        model: MODELO,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            tools: [{ functionDeclarations: ALL_TOOLS }]
        },
        history: historial // Asegúrate de pasar el historial mapeado al formato del nuevo SDK [{ role: 'user', parts: [...] }]
    });

    // Enviamos el mensaje inicial
    let resultado = await chat.sendMessage({ message: mensaje });

    // Verificamos si Gemini requiere llamar a una función (Tool)
    if (resultado.functionCalls && resultado.functionCalls.length > 0) {
        const llamada = resultado.functionCalls[0];
        const resultadoTool = await ejecutarTool(llamada.name, llamada.args);

        // Si es gráfico va directo, no necesita que Gemini lo interprete
        if (resultadoTool?.__tipo === 'grafico') {
            return { tipo: 'grafico', contenido: resultadoTool };
        }

        // Si es información de la BD (Ventas, Insumos, etc), se la devolvemos a Gemini
        // y habilitamos el streaming para la redacción final de la IA
        if (onChunk) {
            const respuestaStream = await chat.sendMessageStream({
                message: [{
                    functionResponse: {
                        name: llamada.name,
                        response: { resultado: resultadoTool }
                    }
                }]
            });

            for await (const chunk of respuestaStream) {
                onChunk(chunk.text);
            }
            return { tipo: 'stream_completado' };
        } else {
            // Fallback síncrono si no pasas un callback de streaming
            const respuestaFinal = await chat.sendMessage({
                message: [{
                    functionResponse: {
                        name: llamada.name,
                        response: { resultado: resultadoTool }
                    }
                }]
            });
            return { tipo: 'texto', contenido: respuestaFinal.text };
        }
    }

    // Si Gemini respondió directamente con texto sin usar herramientas
    if (onChunk) {
        // Para soportar streaming directo de un solo paso tendrías que usar sendMessageStream desde el inicio,
        // pero dado que manejas herramientas interceptadas, este flujo maneja el texto plano de caída.
        onChunk(resultado.text);
        return { tipo: 'stream_completado' };
    }

    return { tipo: 'texto', contenido: resultado.text };
}

module.exports = { procesarMensaje };