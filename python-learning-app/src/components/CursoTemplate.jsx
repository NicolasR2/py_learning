import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Asegúrate de instalar uuid: npm install uuid

// Este es tu componente de curso, ahora con una sesión de código compartida.
export default function CursoTemplate({ curso }) {
  // Estado para guardar el código y salida por cada ejercicio
  const [estadoEjercicios, setEstadoEjercicios] = useState({});
  // Estado para el ID de sesión único para todo el curso
  const [sessionId, setSessionId] = useState("");

  // Generar un UUID único cuando el componente se monta o el curso cambia.
  // Este será el ID de sesión compartido.
  useEffect(() => {
    setSessionId(uuidv4());
  }, [curso.id]);

  // Función para ejecutar el código en el backend de FastAPI
  const ejecutarCodigo = async (ejercicioId) => {
    // Usamos el sessionId del estado, que es el mismo para todos los ejercicios.
    const codigo = estadoEjercicios[ejercicioId]?.codigo || "";

    if (!sessionId) {
        console.error("Aún no se ha generado un ID de sesión.");
        setEstadoEjercicios((prev) => ({
            ...prev,
            [ejercicioId]: { 
                ...(prev[ejercicioId] || { codigo: "", salida: "⏳ Esperando código..." }),
                salida: "❌ Error: No se pudo inicializar la sesión. Intenta recargar la página." 
            },
        }));
        return;
    }

    // Actualizar la salida a "Ejecutando..." mientras esperamos
    setEstadoEjercicios((prev) => ({
        ...prev,
        [ejercicioId]: { 
            ...(prev[ejercicioId] || { codigo: "", salida: "⏳ Esperando código..." }),
            salida: "💻 Ejecutando código..." 
        },
    }));

    const maxRetries = 3;
    const apiKey = "" 

    try {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Usamos el endpoint /execute que definiste en FastAPI
          const resp = await fetch("http://localhost:8000/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              session_id: sessionId, // <-- ¡Aquí está la clave! Usamos el ID compartido
              code: codigo 
            }),
          });

          if (!resp.ok) {
            throw new Error(`Server responded with status ${resp.status}`);
          }

          const data = await resp.json();
          
          let outputText = data.output || "";
          let errorText = data.error || "";
          let finalOutput = "";

          if (errorText.trim()) {
              // Si hay error, lo mostramos
              finalOutput = `❌ ERROR:\n${errorText}`;
          } else if (outputText.trim()) {
              // Si hay salida (e.g., de print())
              finalOutput = outputText;
          } else {
              // Si no hay nada, fue una ejecución "silenciosa"
              finalOutput = "✅ Ejecución exitosa, sin salida en consola.";
          }

          setEstadoEjercicios((prev) => ({
            ...prev,
            [ejercicioId]: { ...prev[ejercicioId], salida: finalOutput },
          }));
          return; // Éxito, salimos del loop
          
        } catch (error) {
          if (attempt < maxRetries - 1) {
            // Reintentar con retroceso exponencial
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
    } catch (err) {
      // Manejo final del error de conexión
      setEstadoEjercicios((prev) => ({
        ...prev,
        [ejercicioId]: { ...prev[ejercicioId], salida: `❌ Error al conectar: ${err.message}` },
      }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4 text-indigo-700 border-b pb-2">
        {curso.titulo}
      </h1>
      <p className="mb-6 text-gray-600">{curso.descripcion}</p>

      {/* Render del contenido mixto (texto + LaTeX) */}
      <div className="mb-8 text-lg leading-relaxed bg-indigo-50 p-4 rounded-xl shadow-inner border border-indigo-200">
        {curso.contenidoLatex.map((item, i) => (
          <span key={i} className="mr-1 inline-block">
            {item.tipo === "texto" ? (
              item.valor
            ) : (
              <code className="bg-white px-2 py-0.5 rounded-md font-mono text-indigo-800 border border-indigo-200">
                🧮 {item.valor}
              </code>
            )}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Ejercicios Prácticos</h2>

      {/* Render de los ejercicios */}
      {curso.ejercicios.map((ej) => (
        <div 
          key={ej.id} 
          className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3 text-indigo-600">
              {ej.titulo}
            </h3>
            <p className="mb-4 text-gray-700 border-l-4 border-indigo-300 pl-3">
              {ej.enunciado}
            </p>

            <textarea
              placeholder="Escribe tu código Python aquí..."
              value={estadoEjercicios[ej.id]?.codigo || ""}
              onChange={(e) =>
                setEstadoEjercicios((prev) => ({
                  ...prev,
                  [ej.id]: { 
                    ...(prev[ej.id] || { salida: "⏳ Esperando código..." }), 
                    codigo: e.target.value 
                  },
                }))
              }
              className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-mono h-40 resize-y transition-colors outline-none"
            />

            <button 
                onClick={() => ejecutarCodigo(ej.id)} 
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Ejecutar Código
            </button>

            <div className="mt-4 p-4 bg-gray-800 text-green-400 rounded-lg shadow-inner overflow-x-auto">
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
