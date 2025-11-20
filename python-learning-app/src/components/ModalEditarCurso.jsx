import { useState } from "react";

export default function ModalEditarCurso({ curso, onClose }) {
  const [ejercicios, setEjercicios] = useState(curso.ejercicios || []);

  const agregarEjercicio = () => {
    const nuevo = { id: Date.now(), titulo: "Nuevo ejercicio", enunciado: "" };
    setEjercicios([...ejercicios, nuevo]);
  };

  const eliminarEjercicio = (id) => {
    setEjercicios(ejercicios.filter((e) => e.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#1F68EA" }}>
          Editar Curso: {curso.titulo}
        </h2>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {ejercicios.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center border p-2 rounded-lg"
            >
              <span>{e.titulo}</span>
              <button
                onClick={() => eliminarEjercicio(e.id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={agregarEjercicio}
          className="mt-4 w-full py-2 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#43A047" }}
        >
          ➕ Añadir Ejercicio
        </button>

        <button
          onClick={onClose}
          className="block mt-3 w-full text-gray-600 hover:underline text-center"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
