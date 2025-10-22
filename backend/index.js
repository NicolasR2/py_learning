import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",       // 👈 tu usuario postgres
  host: "localhost",
  database: "postgres", // 👈 tu base creada
  password: "4123",  // 👈 cámbiala
  port: 5432,
});

// Ruta de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso", userId: user.id_usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.listen(4000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:4000");
});
