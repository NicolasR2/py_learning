import { useState } from "react";

export default function ReentrenamientoModelo() {
  const [status, setStatus] = useState("idle");

  const handleReentrenar = async () => {
    setStatus("training");

    try {
      // Llamada simulada al backend
      await new Promise((r) => setTimeout(r, 3000));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Reentrenamiento del Modelo de ML
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <p className="mb-4 text-gray-700">
          Aquí puedes lanzar manualmente el proceso de reentrenamiento del modelo con los datos más recientes.
        </p>

        <button
          onClick={handleReentrenar}
          className="px-6 py-2 rounded-lg text-white font-semibold shadow-md"
          style={{
            backgroundColor:
              status === "training" ? "#1565C0" : status === "success" ? "#43A047" : "#1F68EA",
          }}
          disabled={status === "training"}
        >
          {status === "training" ? "Entrenando..." : " Reentrenar Modelo"}
        </button>

        {status === "success" && (
          <p className="mt-4 text-green-700 font-medium">
            ✅ Modelo reentrenado exitosamente.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-600 font-medium">
            ❌ Error al reentrenar el modelo.
          </p>
        )}
      </div>
    </div>
  );
}
