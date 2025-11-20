export default function ListaEstudiantes() {
    const estudiantes = [
      { nombre: "Juan Pérez", email: "juan@example.com", progreso: 85 },
      { nombre: "María Gómez", email: "maria@example.com", progreso: 60 },
      { nombre: "Luis Ramírez", email: "luis@example.com", progreso: 95 },
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Estudiantes</h2>
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead style={{ backgroundColor: "#1F68EA" }} className="text-white">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Progreso (%)</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.email} className="border-b hover:bg-gray-50">
                  <td className="p-3">{est.nombre}</td>
                  <td className="p-3">{est.email}</td>
                  <td className="p-3">{est.progreso}%</td>
                  <td className="p-3">
                    <button
                      className="text-sm font-medium rounded-lg px-3 py-1"
                      style={{
                        backgroundColor: "#43A047",
                        color: "white",
                      }}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  