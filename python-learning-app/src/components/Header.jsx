import { useState } from "react";
import { Menu, X } from "lucide-react"; // íconos modernos

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="shadow-md"
      style={{
        backgroundColor: "#1F68EA", // azul eléctrico principal
        color: "#FFFFFF",
      }}
    >
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide">Python Learning</h1>

        {/* Botón Hamburguesa */}
        <button
          className="md:hidden block"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en pantallas grandes */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <a
            href="#"
            className="transition-colors"
            style={{ color: "#FFFFFF" }}
            onMouseOver={(e) => (e.target.style.color = "#A5D6A7")} // verde menta claro
            onMouseOut={(e) => (e.target.style.color = "#FFFFFF")}
          >
            Cursos
          </a>
          <a
            href="#"
            className="transition-colors"
            style={{ color: "#FFFFFF" }}
            onMouseOver={(e) => (e.target.style.color = "#A5D6A7")}
            onMouseOut={(e) => (e.target.style.color = "#FFFFFF")}
          >
            Progreso
          </a>
          <a
            href="#"
            className="transition-colors"
            style={{ color: "#FFFFFF" }}
            onMouseOver={(e) => (e.target.style.color = "#A5D6A7")}
            onMouseOut={(e) => (e.target.style.color = "#FFFFFF")}
          >
            Perfil
          </a>
        </nav>
      </div>

      {/* Menú desplegable móvil */}
      {open && (
        <nav
          className="flex flex-col space-y-4 px-6 pb-4 md:hidden transition-all"
          style={{
            backgroundColor: "#1F68EA", // azul más oscuro
          }}
        >
          <a
            href="#"
            className="text-white hover:text-[#A5D6A7]"
          >
            Cursos
          </a>
          <a
            href="#"
            className="text-white hover:text-[#A5D6A7]"
          >
            Progreso
          </a>
          <a
            href="#"
            className="text-white hover:text-[#A5D6A7]"
          >
            Perfil
          </a>
        </nav>
      )}
    </header>
  );
}
