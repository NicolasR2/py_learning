export default function RevisionCursos() {
    const cursos = [
      { id: 1, titulo: "Introducción a Python", ejercicios: 5 },
      { id: 2, titulo: "Estructuras de Datos", ejercicios: 7 },
      { id: 3, titulo: "Programación Funcional", ejercicios: 4 },
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Revisión de Cursos</h2>
        <button
          className="mb-4 px-4 py-2 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#43A047" }}
        >
           Añadir nuevo curso
        </button>
        <div className="grid md:grid-cols-2 gap-6">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-700">
                {curso.titulo}
              </h3>
              <p className="text-gray-600 mb-4">
                {curso.ejercicios} ejercicios disponibles
              </p>
              <div className="flex gap-3">
                <button
                  className="px-3 py-1 rounded-lg font-medium text-white"
                  style={{ backgroundColor: "#1F68EA" }}
                >
                Editar
                </button>
                <button
                  className="px-3 py-1 rounded-lg font-medium text-white"
                  style={{ backgroundColor: "#D32F2F" }}
                >
                Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  