import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// Servidor en puerto 4000
app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
