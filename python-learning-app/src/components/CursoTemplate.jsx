import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlockMath, InlineMath } from "react-katex"; // para latex

export default function CursoTemplate({ curso }) {
  const [estadoEjercicios, setEstadoEjercicios] = useState({});
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(uuidv4());
  }, [curso.id]);

  const ejecutarCodigo = async (ejercicioId) => {
    const codigo = estadoEjercicios[ejercicioId]?.codigo || "";
    if (!sessionId) {
      setEstadoEjercicios((prev) => ({
        ...prev,
        [ejercicioId]: {
          ...(prev[ejercicioId] || { codigo: "", salida: "" }),
          salida:
            "❌ Error: No se pudo inicializar la sesión. Intenta recargar la página.",
        },
      }));
      return;
    }

    setEstadoEjercicios((prev) => ({
      ...prev,
      [ejercicioId]: {
        ...(prev[ejercicioId] || { codigo: "", salida: "" }),
        salida: "💻 Ejecutando código...",
      },
    }));

    try {
      const resp = await fetch("http://localhost:8000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          code: codigo,
        }),
      });

      const data = await resp.json();
      const outputText = data.output || "";
      const errorText = data.error || "";

      const finalOutput = errorText.trim()
        ? `❌ ERROR:\n${errorText}`
        : outputText.trim()
        ? outputText
        : "✅ Ejecución exitosa, sin salida en consola.";

      setEstadoEjercicios((prev) => ({
        ...prev,
        [ejercicioId]: { ...prev[ejercicioId], salida: finalOutput },
      }));
    } catch (err) {
      setEstadoEjercicios((prev) => ({
        ...prev,
        [ejercicioId]: {
          ...prev[ejercicioId],
          salida: `❌ Error al conectar: ${err.message}`,
        },
      }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1
        className="text-3xl font-extrabold mb-4 border-b pb-2"
        style={{ color: "#1F68EA", borderColor: "#1F68EA" }}
      >
        {curso.titulo}
      </h1>
      <p className="mb-6 text-gray-700">{curso.descripcion}</p>

      {/* Render del contenido con texto y LaTeX */}
      <div
        className="mb-8 text-lg leading-relaxed p-4 rounded-xl shadow-sm"
        style={{
          backgroundColor: "#F5F5F5",
          borderLeft: "4px solid #1F68EA",
          textAlign: curso.alineacion || "left", // <-- control desde el JSON
        }}
      >
        {curso.contenidoLatex.map((item, i) => (
          <span key={i} className="mr-1 inline-block align-middle">
            {item.tipo === "texto" ? (
              item.valor
            ) : item.tipo === "latex" ? (
              <InlineMath math={item.valor} />
            ) : (
              <BlockMath math={item.valor} />
            )}
          </span>
        ))}
      </div>

      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "#263238" }}
      >
        Ejercicios Prácticos
      </h2>

      {/* Render de los ejercicios */}
      {curso.ejercicios.map((ej) => (
        <div
          key={ej.id}
          className="mb-8 rounded-xl shadow-md hover:shadow-xl transition-all"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E0E0E0",
          }}
        >
          <div className="p-6">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "#1F68EA" }}
            >
              {ej.titulo}
            </h3>

            <p
              className="mb-4 text-gray-700 pl-3 border-l-4"
              style={{ borderColor: "#43A047" }}
            >
              {ej.enunciado}
            </p>

            <textarea
              placeholder="Escribe tu código Python aquí..."
              value={estadoEjercicios[ej.id]?.codigo || ""}
              onChange={(e) =>
                setEstadoEjercicios((prev) => ({
                  ...prev,
                  [ej.id]: {
                    ...(prev[ej.id] || { salida: "" }),
                    codigo: e.target.value,
                  },
                }))
              }
              className="w-full p-3 rounded-lg font-mono h-40 resize-y transition-all outline-none focus:ring-2"
              style={{
                borderColor: "#1F68EA",
                color: "#263238",
                backgroundColor: "#FFFFFF",
              }}
            />

            <button
              onClick={() => ejecutarCodigo(ej.id)}
              className="inline-flex items-center font-bold py-2 px-4 rounded-lg mt-3 transition-transform transform hover:scale-[1.01]"
              style={{
                backgroundColor: "#43A047",
                color: "#FFFFFF",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2E7D32")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#43A047")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Ejecutar Código
            </button>

            <div
              className="mt-4 p-4 rounded-lg shadow-inner overflow-x-auto"
              style={{
                backgroundColor: "#263238",
                color: "#A5D6A7",
              }}
            >
              <pre className="whitespace-pre-wrap">
                {estadoEjercicios[ej.id]?.salida || "⏳ Esperando código..."}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
