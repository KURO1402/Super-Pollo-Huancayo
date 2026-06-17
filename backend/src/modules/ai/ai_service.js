const { GoogleGenAI } = require('@google/genai');
const { toolVentas, toolTopProductos, toolProductos, toolProductosInsumos } = require('./tools');
const {
    obtenerResumenVentas,
    obtenerDetalleVentas,
    obtenerTopProductosVendidos,
    obtenerCatalogoProductos,
    obtenerProductosConInsumos,
} = require('./ai_model');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompt dinámico con fecha/hora actual
const generarSystemPrompt = () => {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-PE', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const hora = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ((ahora.getDay() + 6) % 7));
    const inicioSemanaStr = inicioSemana.toISOString().split('T')[0];

    const inicioMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-01`;
    const finMes    = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split('T')[0];

    const ayer = new Date(ahora);
    ayer.setDate(ahora.getDate() - 1);
    const ayerStr = ayer.toISOString().split('T')[0];
    const hoyStr  = ahora.toISOString().split('T')[0];

    return `Eres PolloBot, el asistente administrativo interno del restaurante Super Pollo de Huancayo.
Solo interactúas con personal administrativo autenticado. Nunca con clientes.

FECHA Y HORA ACTUAL DEL SISTEMA:
- Hoy       : ${fecha}, ${hora}
- Fecha ISO : ${hoyStr}
- Ayer      : ${ayerStr}
- Esta semana (desde el lunes): ${inicioSemanaStr} al ${hoyStr}
- Este mes  : ${inicioMes} al ${finMes}

Usa estos valores para resolver expresiones como "hoy", "ayer", "esta semana" o "este mes".
Si el usuario no especifica fechas, usa el día de hoy (${hoyStr}) como rango por defecto e indícaselo.

REGLAS:
- Responde siempre en español, de forma clara y directa.
- Usa EXCLUSIVAMENTE las herramientas provistas para obtener datos. Nunca inventes cifras.
- Responde SIEMPRE en texto plano y limpio. Prohibido usar markdown: sin asteriscos, sin almohadillas, sin símbolos de tabla (|), sin guiones para tablas, sin backticks.
- Usa listas numeradas simples (1. 2. 3.) solo cuando necesites enumerar varios elementos.
- Si el usuario pide un gráfico o reporte visual, responde que esa función estará disponible próximamente.
- Si la consulta es ambigua, responde con lo que tengas y ofrece más detalle.
- Tienes acceso al historial de la conversación: úsalo para entender referencias
  como "el de antes", "esa semana", "compáralo con esto", etc.`;
};

const ALL_TOOLS = [
    { functionDeclarations: [toolVentas, toolTopProductos, toolProductos, toolProductosInsumos] }
];

// Ejecutor de tools — soporta múltiples en paralelo
const ejecutarTool = async (nombre, args) => {
    switch (nombre) {
        case 'consultarVentas':
            return args.tipo === 'resumen'
                ? obtenerResumenVentas(args.fecha_inicio, args.fecha_fin)
                : obtenerDetalleVentas(args.fecha_inicio, args.fecha_fin);
        case 'consultarTopProductos':
            return obtenerTopProductosVendidos(args.fecha_inicio, args.fecha_fin);
        case 'consultarProductos':
            return obtenerCatalogoProductos(args.id_categoria ?? null, args.nombre ?? null);
        case 'consultarProductosConInsumos':
            return obtenerProductosConInsumos(args.id_producto ?? null);
        default:
            throw new Error(`Tool no registrada: ${nombre}`);
    }
};

// Procesamiento principal con historial
const procesarMensajeStream = async (mensaje, historial, res) => {
    const systemPrompt = generarSystemPrompt();

    // Cabeceras para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const contents = [
        ...historial,
        { role: 'user', parts: [{ text: mensaje }] }
    ];

    try {
        // ── Paso 1: llamada sin stream para detectar si necesita tools ──
        const primeraRespuesta = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents,
            config: {
                systemInstruction: systemPrompt,
                tools: ALL_TOOLS
            }
        });

        const functionCalls = primeraRespuesta.functionCalls;

        if (functionCalls && functionCalls.length > 0) {

            // ── Paso 2: ejecutar TODAS las tools en paralelo ──
            const resultados = await Promise.all(
                functionCalls.map(async (llamada) => {
                    let resultado;
                    try {
                        resultado = await ejecutarTool(llamada.name, llamada.args);
                    } catch (err) {
                        resultado = { error: err.message };
                    }
                    return {
                        nombre: llamada.name,
                        resultado
                    };
                })
            );

            // ── Paso 3: armar las respuestas de tools para Gemini ──
            const toolResponseParts = resultados.map(({ nombre, resultado }) => ({
                functionResponse: {
                    name: nombre,
                    response: { resultado }
                }
            }));

            // ── Paso 4: segunda llamada CON stream, pasando resultados de tools ──
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [
                    ...contents,
                    primeraRespuesta.candidates[0].content,   // respuesta del modelo con function calls
                    { role: 'tool', parts: toolResponseParts } // resultados de las tools
                ],
                config: { systemInstruction: systemPrompt }
            });

            for await (const chunk of stream) {
                const texto = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                if (texto) res.write(texto);
            }

        } else {
            // ── Sin tools: stream directo ──
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents,
                config: {
                    systemInstruction: systemPrompt,
                    tools: ALL_TOOLS
                }
            });

            for await (const chunk of stream) {
                const texto = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                if (texto) res.write(texto);
            }
        }

        res.end();

    } catch (err) {
        console.error('Error en PolloBot stream:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error interno al procesar el mensaje.' });
        } else {
            res.end();
        }
    }
};

module.exports = { procesarMensajeStream };