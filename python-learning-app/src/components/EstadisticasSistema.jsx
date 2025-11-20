import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EstadisticasSistema() {
  const data = [
    { name: "Enero", estudiantes: 40, ejercicios: 120 },
    { name: "Febrero", estudiantes: 55, ejercicios: 150 },
    { name: "Marzo", estudiantes: 60, ejercicios: 180 },
    { name: "Abril", estudiantes: 70, ejercicios: 200 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Estadísticas Globales del Sistema</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Evolución de Uso</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="estudiantes" fill="#1F68EA" />
            <Bar dataKey="ejercicios" fill="#43A047" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
