import { useState } from "react";
import { Users, BarChart3, Cpu, Settings } from "lucide-react";
import GestionUsuarios from "../components/GestionUsuarios";
import EstadisticasSistema from "../components/EstadisticasSistema";
import ReentrenamientoModelo from "../components/ReentrenamientoModelo";

export default function AdminDashboard() {
  const [view, setView] = useState("usuarios");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className="w-64 text-white flex flex-col"
        style={{ backgroundColor: "#1F68EA" }}
      >
        <div className="p-6 text-2xl font-bold border-b border-blue-400">
          Panel Administrador
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView("usuarios")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              view === "usuarios" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            <Users size={20} /> Gestión de Usuarios
          </button>
          <button
            onClick={() => setView("estadisticas")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              view === "estadisticas" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            <BarChart3 size={20} /> Estadísticas Globales
          </button>
          <button
            onClick={() => setView("reentrenamiento")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              view === "reentrenamiento" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            <Cpu size={20} /> Reentrenamiento ML
          </button>
          <button
            onClick={() => setView("config")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              view === "config" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            <Settings size={20} /> Configuración
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {view === "usuarios" && <GestionUsuarios />}
        {view === "estadisticas" && <EstadisticasSistema />}
        {view === "reentrenamiento" && <ReentrenamientoModelo />}
        {view === "config" && (
          <p className="text-gray-700 text-lg">Configuraciones generales del sistema.</p>
        )}
      </main>
    </div>
  );
}
