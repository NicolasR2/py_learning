import { useState } from "react";
import { Menu, X } from "lucide-react"; // íconos modernos

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold">Python Learning</h1>

        {/* Botón Hamburguesa */}
        <button
          className="md:hidden block"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en pantallas grandes */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <a href="#" className="hover:text-gray-200">Cursos</a>
          <a href="#" className="hover:text-gray-200">Info</a>
          <a href="#" className="hover:text-gray-200">Noticias</a>
        </nav>
      </div>

      {/* Menú desplegable en móvil */}
      {open && (
        <nav className="flex flex-col space-y-4 px-6 pb-4 md:hidden bg-blue-700">
          <a href="#" className="hover:text-gray-200">Cursos</a>
          <a href="#" className="hover:text-gray-200">Info</a>
          <a href="#" className="hover:text-gray-200">Noticias</a>
        </nav>
      )}
    </header>
  );
}
