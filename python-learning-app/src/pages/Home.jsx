import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-8 grid md:grid-cols-3 gap-6">
        {/* Cursos */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Cursos</h2>
          <p className="text-gray-600 mb-4">
            Aprende Python desde cero con ejercicios prácticos.
          </p>
          <Link
            to="/cursos"
            className="text-blue-600 hover:underline font-medium"
          >
            Ir a Cursos →
          </Link>
        </section>

        {/* Info */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Info</h2>
          <p className="text-gray-600">
            Encuentra recursos y documentación para reforzar tu aprendizaje.
          </p>
        </section>

        {/* Noticias */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Noticias</h2>
          <p className="text-gray-600">
            Mantente actualizado con las últimas tendencias de Python.
          </p>
        </section>
      </main>
    </div>
  );
}
