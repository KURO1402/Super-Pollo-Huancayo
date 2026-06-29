import ReactMarkdown from 'react-markdown';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { RiRobot2Line } from "react-icons/ri";

const BurbujaTyping = () => (
  <div className="flex items-end gap-2 max-w-[85%]">
    <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 self-end mb-0.5">
      <RiRobot2Line className="text-red-600 dark:text-red-400" size={14} />
    </div>
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5 h-4">
        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '900ms' }} />
        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '180ms', animationDuration: '900ms' }} />
        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '360ms', animationDuration: '900ms' }} />
      </div>
    </div>
  </div>
);

const GraficoRecharts = ({ grafico }) => {
  console.log('GRAFICO DATA:', JSON.stringify(grafico, null, 2)); 
  if (!grafico) return null;
  const { tipo, titulo, data, lineas, barras, ejeX, ejeY, apilado, layout } = grafico;
  const estiloContenedor = { width: '100%', height: 260 };

  if (tipo === 'LineChart') return (
    <div className="mt-3">
      {titulo && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{titulo}</p>}
      <ResponsiveContainer {...estiloContenedor}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={ejeX} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip /><Legend />
          {(lineas || []).map(l => <Line key={l.clave} type="monotone" dataKey={l.clave} name={l.nombre} stroke={l.color} dot={false} strokeWidth={2} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  if (tipo === 'BarChart') return (
    <div className="mt-3">
      {titulo && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{titulo}</p>}
      <ResponsiveContainer {...estiloContenedor}>
        <BarChart data={data} layout={layout || 'horizontal'}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {layout === 'vertical'
            ? <><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey={ejeY} type="category" tick={{ fontSize: 11 }} width={130} /></>
            : <><XAxis dataKey={ejeX} tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /></>}
          <Tooltip /><Legend />
          {(barras || []).map(b => (
            <Bar key={b.clave} dataKey={b.clave} name={b.nombre} fill={b.color || '#4F8EF7'} stackId={apilado ? 'a' : undefined}>
              {b.colorPorDato && data.map((entry, i) => <Cell key={i} fill={entry.fill || '#4F8EF7'} />)}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (tipo === 'PieChart') return (
    <div className="mt-3">
      {titulo && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{titulo}</p>}
      <ResponsiveContainer {...estiloContenedor}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return <p className="text-xs text-gray-400 mt-2">Tipo de gráfico no soportado: {tipo}</p>;
};

// Componentes markdown estilizados para la burbuja del bot
const componentesMarkdown = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) =>
    inline
      ? <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
      : <pre className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-xs font-mono overflow-x-auto mb-2"><code>{children}</code></pre>,
  h1: ({ children }) => <h1 className="text-base font-semibold mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-sm font-semibold mb-1.5">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
};

const MensajeChat = ({ rol, texto, hora, grafico = null, esUltimoBot = false, cargandoRespuesta = false }) => {
  const esMio = rol === 'usuario';

  if (!esMio && texto === '') return <BurbujaTyping />;

  const mostrarCursor = !esMio && esUltimoBot && cargandoRespuesta;

  return (
    <div className={`flex items-end gap-2 ${esMio ? 'flex-row-reverse' : ''} max-w-[85%] ${esMio ? 'ml-auto' : ''}`}>
      {!esMio && (
        <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 self-end mb-0.5">
          <RiRobot2Line className="text-red-600 dark:text-red-400" size={14} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed
          ${esMio
            ? 'bg-red-600 dark:bg-red-500 text-white rounded-br-sm whitespace-pre-wrap'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
          }`}
        >
          {esMio
            ? texto
            : (
              <>
                <ReactMarkdown components={componentesMarkdown}>{texto}</ReactMarkdown>
                {mostrarCursor && (
                  <span
                    className="inline-block w-0.5 h-3.5 bg-gray-400 dark:bg-gray-400 ml-0.5 align-middle rounded-sm"
                    style={{ animation: 'blink 0.8s step-end infinite' }}
                  />
                )}
                {grafico && <GraficoRecharts grafico={grafico} />}
              </>
            )
          }
        </div>

        <span className={`text-[11px] text-gray-400 dark:text-gray-500 ${esMio ? 'text-right' : 'text-left'} px-1`}>
          {hora}
        </span>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MensajeChat;