import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Home() {
  const cursos = [
    {
      id: 1,
      titulo: "Introducción a Python",
      descripcion: "Aprende los fundamentos del lenguaje y su sintaxis básica.",
      progreso: 0,
    },

  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F5F5F5", color: "#263238" }}
    >
      <Header />

      <main className="p-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <section
            key={curso.id}
            className="rounded-2xl shadow-md p-6 transition-transform transform hover:scale-[1.02]"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-xl font-semibold mb-2">{curso.titulo}</h2>
            <p className="text-sm mb-4 text-gray-600">{curso.descripcion}</p>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div
                className="h-3 rounded-full"
                style={{
                  backgroundColor: "#E0E0E0",
                }}
              >
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${curso.progreso}%`,
                    backgroundColor: "#43A047", // verde menta
                  }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-right text-gray-600">
                {curso.progreso}% completado
              </p>
            </div>

            {/* Botón de acción */}
            <Link
              to={`/curso/${curso.id}`}
              className="block text-center p-2 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: "#1F68EA", // azul eléctrico
                color: "#FFFFFF",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1565C0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1E88E5")}
            >
              Continuar →
            </Link>
          </section>
        ))}
      </main>
    </div>
  );
}
