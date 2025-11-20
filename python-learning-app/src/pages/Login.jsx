import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error en login");
        return;
      }

      localStorage.setItem("userId", data.userId);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#F5F5F5" }} // gris perla
    >
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-2xl shadow-md w-80"
        style={{
          backgroundColor: "#FFFFFF", // blanco
          color: "#263238", // texto principal azul grisáceo
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none"
          style={{
            borderColor: "#43A047", // borde verde menta
          }}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none"
          style={{
            borderColor: "#43A047", // borde verde menta
          }}
          required
        />

        {error && (
          <p
            className="text-sm mb-3 text-center"
            style={{ color: "#FFC107" }} // mensaje ámbar
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full p-2 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor: "#1F68EA", // azul eléctrico
            color: "#FFFFFF",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1565C0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1E88E5")}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
