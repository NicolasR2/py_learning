import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlockMath, InlineMath } from "react-katex";

// ====== DATOS MOCK DEL CURSO ======
const CURSO_MOCK = {
  curso: {
    id: 1,
    titulo: "Introducción a Python",
    descripcion: "Aprende los fundamentos de Python desde cero",
    modulos: [
      {
        id: 1,
        titulo: "Módulo 1: Primeros Pasos",
        submodulos: [
          {
            id: 1,
            titulo: "1.1 Variables y Tipos de Datos",
            teoria: [
              { tipo: "texto", valor: "En Python, las variables se crean asignando un valor. " },
              { tipo: "codigo", valor: 'nombre = "Juan"\nedad = 25' }
            ],
            ejemplos: [
              {
                descripcion: "Ejemplo básico",
                codigo: 'nombre = "María"\nprint(nombre)',
                salida: "María"
              }
            ],
            ejercicios: {
              facil: [
                {
                  id: 1,
                  tipo: "interpretar",
                  enunciado: "¿Qué imprimirá?\n\nx = 5\ny = 2\nprint(x * y)",
                  respuestas_correctas: ["10"],
                  salida: null
                }
              ],
              intermedio: [
                {
                  id: 3,
                  tipo: "escribir",
                  enunciado: "Crea una variable 'mensaje' con 'Hola Mundo' e imprímela.",
                  respuestas_correctas: [],
                  salida: "Hola Mundo"
                }
              ],
              dificil: []
            }
          }
        ]
      }
    ]
  }
};

const DIFICULTADES = ["facil", "intermedio", "dificil"];

// ====== CONFIGURACIÓN ======
const USAR_BASE_DATOS = false; // Cambia a true cuando tengas el backend listo

// ====== FUNCIONES API ======
const API = {
  // Cargar progreso del estudiante desde la DB
  async cargarProgreso(idEstudiante, idCurso) {
    if (!USAR_BASE_DATOS) {
      console.log("⚠️ Modo sin base de datos - progreso no se guardará");
      return null;
    }

    try {
      const response = await fetch(`/api/progreso/${idEstudiante}/${idCurso}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.log("No se pudo cargar progreso, iniciando desde cero");
      return null;
    }
  },

  // Guardar progreso en la DB
  async guardarProgreso(data) {
    if (!USAR_BASE_DATOS) {
      console.log("💾 Progreso local (no guardado en DB):", data);
      return;
    }

    try {
      await fetch('/api/progreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  }
};

export default function CursoTemplate({ curso, idEstudiante = 1 }) {
  // Usar datos mock si no se pasa curso
  const cursoData = curso || CURSO_MOCK;
  
  const [sessionId, setSessionId] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState({});
  const [progreso, setProgreso] = useState({}); // { submodulo_id: { dificultad: "completado/fallado" } }
  const [cargando, setCargando] = useState(true);

  // Cargar progreso al iniciar
  useEffect(() => {
    const inicializar = async () => {
      setSessionId(uuidv4());
      
      // Intentar cargar progreso de la DB
      const progresoGuardado = await API.cargarProgreso(idEstudiante, cursoData.curso.id);
      
      if (progresoGuardado) {
        // Convertir progreso de DB al formato local
        const progresoFormateado = convertirProgresoDBaLocal(progresoGuardado);
        setProgreso(progresoFormateado);
      }
      
      setCargando(false);
    };

    inicializar();
  }, [cursoData.curso.id, idEstudiante]);

  // Convertir progreso de DB a formato local
  const convertirProgresoDBaLocal = (progresoArray) => {
    const resultado = {};
    
    progresoArray.forEach(p => {
      if (!resultado[p.id_submodulo]) {
        resultado[p.id_submodulo] = {};
      }
      
      resultado[p.id_submodulo][p.dificultad] = p.completado ? "completado" : "fallado";
    });
    
    return resultado;
  };

  // Guardar progreso en DB
  const guardarProgresoEnDB = async (idEjercicio, idSubmodulo, dificultad, completado, error = null) => {
    const data = {
      id_estudiante: idEstudiante,
      id_ejercicio: idEjercicio,
      id_curso: cursoData.curso.id,
      id_submodulo: idSubmodulo,
      dificultad: dificultad,
      completado: completado,
      intentos: 1, // Incrementar en backend
      error_tipo: error
    };

    await API.guardarProgreso(data);
  };

  const obtenerDificultadActual = (submoduloId, ejercicios) => {
    const progresoSub = progreso[submoduloId] || {};

    for (const dif of DIFICULTADES) {
      if (!ejercicios[dif] || ejercicios[dif].length === 0) continue;

      const estado = progresoSub[dif];
      if (!estado || estado === "fallado") {
        return dif;
      }
    }
    return null;
  };

  /**********************
   * VERIFICAR RESPUESTA
   **********************/
  const verificarRespuesta = (ejercicio, submoduloId, dificultad) => {
    const id = ejercicio.id;
    const userInput = (respuestas[id] || "").trim();

    const respuestasCorrectas = ejercicio.respuestas_correctas || [];
    const salidaEsperada = ejercicio.salida?.trim();

    let isCorrect = false;

    if (respuestasCorrectas.length > 0) {
      isCorrect = respuestasCorrectas.some((r) => r.trim() === userInput);
    } else if (salidaEsperada) {
      isCorrect = userInput === salidaEsperada;
    }

    setResultados((prev) => ({
      ...prev,
      [id]: isCorrect ? "correcto" : "incorrecto",
    }));

    // Guardar en DB
    guardarProgresoEnDB(id, submoduloId, dificultad, isCorrect);

    if (isCorrect) {
      setTimeout(() => {
        setProgreso((prev) => ({
          ...prev,
          [submoduloId]: {
            ...(prev[submoduloId] || {}),
            [dificultad]: "completado",
          },
        }));
        setRespuestas((prev) => ({ ...prev, [id]: "" }));
        setResultados((prev) => ({ ...prev, [id]: null }));
      }, 1200);
    }
  };

  /**********************
   * EJECUTAR CÓDIGO PYTHON
   **********************/
  const ejecutarCodigo = async (ejercicio, submoduloId, dificultad) => {
    const id = ejercicio.id;
    const codigo = respuestas[id] || "";

    if (!codigo.trim()) {
      setResultados((prev) => ({
        ...prev,
        [id]: "❌ Escribe tu código antes de ejecutar",
      }));
      return;
    }

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
      const output = data.error ? `❌ ERROR:\n${data.error}` : data.output.trim();

      const respuestasCorrectas = ejercicio.respuestas_correctas || [];
      const salidaEsperada = ejercicio.salida?.trim();

      let isCorrect = false;

      if (respuestasCorrectas.length > 0) {
        isCorrect = respuestasCorrectas.includes(codigo.trim());
      }

      if (salidaEsperada) {
        isCorrect = isCorrect || (output === salidaEsperada);
      }

      // Guardar progreso con tipo de error si falló
      guardarProgresoEnDB(id, submoduloId, dificultad, isCorrect, data.error || null);

      if (isCorrect) {
        setResultados((prev) => ({
          ...prev,
          [id]: "correcto_con_codigo",
        }));

        setTimeout(() => {
          setProgreso((prev) => ({
            ...prev,
            [submoduloId]: {
              ...(prev[submoduloId] || {}),
              [dificultad]: "completado",
            },
          }));
          setRespuestas((prev) => ({ ...prev, [id]: "" }));
          setResultados((prev) => ({ ...prev, [id]: null }));
        }, 1200);
      } else {
        setResultados((prev) => ({
          ...prev,
          [id]: `salida:\n${output || "(sin salida)"}`,
        }));
      }
    } catch (e) {
      setResultados((prev) => ({
        ...prev,
        [id]: "❌ Error al conectar con el servidor",
      }));
    }
  };

  /**********************
   * RENDER DE TEORÍA
   **********************/
  const renderTeoria = (teoria) => {
    return teoria.map((item, i) => {
      if (item.tipo === "texto") return <span key={i}>{item.valor}</span>;
      if (item.tipo === "codigo")
        return (
          <pre key={i} className="bg-black text-green-300 p-2 rounded-md my-2">
            {item.valor}
          </pre>
        );
      if (item.tipo === "latex")
        return <InlineMath key={i} math={item.valor} />;

      return null;
    });
  };

  /**********************
   * RENDER DE EJERCICIO
   **********************/
  const renderEjercicio = (ej, dificultad, submoduloId) => {
    const id = ej.id;
    const resultado = resultados[id];

    return (
      <div key={id} className="p-4 my-4 rounded-xl shadow border bg-white">
        <h3 className="text-lg font-bold text-blue-700">
          [{dificultad.toUpperCase()}] {ej.tipo.toUpperCase()}
        </h3>

        <p className="text-gray-700 whitespace-pre-line mb-2">{ej.enunciado}</p>

        <textarea
          className="w-full p-2 rounded border font-mono"
          rows={4}
          placeholder="Tu respuesta aquí..."
          value={respuestas[id] || ""}
          onChange={(e) =>
            setRespuestas((prev) => ({ ...prev, [id]: e.target.value }))
          }
          disabled={resultado === "correcto" || resultado === "correcto_con_codigo"}
        />

        <div className="flex gap-3 mt-2">
          {ej.tipo === "escribir" ? (
            <button
              onClick={() => ejecutarCodigo(ej, submoduloId, dificultad)}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={resultado === "correcto" || resultado === "correcto_con_codigo"}
            >
              Ejecutar código
            </button>
          ) : (
            <button
              onClick={() => verificarRespuesta(ej, submoduloId, dificultad)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={resultado === "correcto" || resultado === "correcto_con_codigo"}
            >
              Verificar
            </button>
          )}
        </div>

        {resultado && (
          <div className="mt-3 p-2 rounded bg-gray-100">
            {resultado === "correcto" && (
              <p className="text-green-700 font-bold">✅ ¡Respuesta correcta!</p>
            )}

            {resultado === "incorrecto" && (
              <p className="text-red-700 font-bold">
                ❌ Respuesta incorrecta, intenta de nuevo
              </p>
            )}

            {resultado === "correcto_con_codigo" && (
              <p className="text-green-700 font-bold">
                ✅ Código correcto y ejecutado
              </p>
            )}

            {typeof resultado === "string" && resultado.includes("salida") && (
              <pre className="bg-black text-green-300 p-2 rounded mt-2">
                {resultado}
              </pre>
            )}

            {typeof resultado === "string" &&
              resultado.includes("❌") &&
              !resultado.includes("salida") && (
                <p className="text-red-700 text-sm">{resultado}</p>
              )}
          </div>
        )}
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando curso...</div>
      </div>
    );
  }

  /**********************
   * RENDER PRINCIPAL
   **********************/
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-700">
        {cursoData.curso.titulo}
      </h1>

      <p className="text-gray-700 mb-6">{cursoData.curso.descripcion}</p>

      {cursoData.curso.modulos.map((modulo) => (
        <div key={modulo.id} className="my-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {modulo.titulo}
          </h2>

          {modulo.submodulos.map((sub) => {
            const dificultadActual = obtenerDificultadActual(
              sub.id,
              sub.ejercicios
            );
            const todosCompletados = !dificultadActual;

            return (
              <div key={sub.id} className="p-5 bg-gray-50 rounded-xl mb-6">
                <h3 className="text-xl font-semibold text-blue-600">
                  {sub.titulo}
                </h3>

                {/* Estado de progreso */}
                <div className="mt-3 mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-semibold text-blue-700">
                    Progreso:
                  </p>
                  <div className="flex gap-2 mt-2">
                    {DIFICULTADES.map((dif) => {
                      const ejerciciosExisten =
                        sub.ejercicios[dif] && sub.ejercicios[dif].length > 0;
                      const estado =
                        (progreso[sub.id] || {})[dif] || "pendiente";

                      if (!ejerciciosExisten) return null;

                      return (
                        <div
                          key={dif}
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            estado === "completado"
                              ? "bg-green-500 text-white"
                              : estado === "fallado"
                              ? "bg-yellow-500 text-white"
                              : dif === dificultadActual
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {dif} {estado === "completado" && "✓"}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {todosCompletados && (
                  <div className="p-3 bg-green-100 border border-green-400 rounded mb-4">
                    <p className="text-green-800 font-bold">
                      🎉 ¡Felicidades! Completaste todos los ejercicios de este
                      módulo.
                    </p>
                  </div>
                )}

                {/* TEORÍA */}
                <div className="mt-4 text-lg">{renderTeoria(sub.teoria)}</div>

                {/* EJEMPLOS */}
                <h4 className="text-lg font-bold mt-4">Ejemplos:</h4>
                {sub.ejemplos.map((ej, i) => (
                  <div key={i} className="my-2 bg-white p-3 rounded">
                    <p className="font-semibold">{ej.descripcion}</p>
                    <pre className="bg-black text-green-300 p-2 mt-1 rounded">
                      {ej.codigo}
                    </pre>
                    <p className="text-sm text-gray-600">Salida: {ej.salida}</p>
                  </div>
                ))}

                {/* EJERCICIOS */}
                <h4 className="text-xl font-bold mt-6">Ejercicios</h4>

                {dificultadActual ? (
                  <div>
                    {sub.ejercicios[dificultadActual].map((ej) =>
                      renderEjercicio(ej, dificultadActual, sub.id)
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">
                    Todos los ejercicios completados ✓
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}