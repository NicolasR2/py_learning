export default function GestionUsuarios() {
    const usuarios = [
      { nombre: "Juan Pérez", rol: "Estudiante", correo: "juan@example.com" },
      { nombre: "María Gómez", rol: "Docente", correo: "maria@example.com" },
      { nombre: "Admin", rol: "Administrador", correo: "admin@example.com" },
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Usuarios</h2>
  
        <button
          className="mb-4 px-4 py-2 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#43A047" }}
        >
          Crear Usuario
        </button>
  
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead style={{ backgroundColor: "#1F68EA" }} className="text-white">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.correo} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.correo}</td>
                  <td className="p-3">{u.rol}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="px-3 py-1 rounded-lg text-white font-medium"
                      style={{ backgroundColor: "#1F68EA" }}
                    >
                       Editar
                    </button>
                    <button
                      className="px-3 py-1 rounded-lg text-white font-medium"
                      style={{ backgroundColor: "#D32F2F" }}
                    >
                       Eliminar
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
  