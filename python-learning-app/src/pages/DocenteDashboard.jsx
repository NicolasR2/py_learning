import { useState } from "react";
import { BookOpen, Users, Settings } from "lucide-react";
import ListaEstudiantes from "../components/ListaEstudiantes";
import RevisionCursos from "../components/RevisionCursos";
import ModalEditarCurso from "../components/ModalEditarCurso";


export default function DocenteDashboard() {
  const [view, setView] = useState("estudiantes");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className="w-64 text-white flex flex-col"
        style={{ backgroundColor: "#1F68EA" }}
      >
        <div className="p-6 text-2xl font-bold border-b border-blue-400">
          Panel Docente
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView("estudiantes")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              view === "estudiantes" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            <Users size={20} /> Estudiantes
          </button>
          <button
            onClick={() => setView("cursos")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              view === "cursos" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            <BookOpen size={20} /> Revisión de Cursos
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

      {/* Contenido dinámico */}
      <main className="flex-1 p-8 overflow-y-auto">
        {view === "estudiantes" && <ListaEstudiantes />}
        {view === "cursos" && <RevisionCursos />}
        {view === "config" && <Configuracion />}
      </main>
    </div>
  );
}
