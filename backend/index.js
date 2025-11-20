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
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "4123",
  port: 5432,
});

// ==========================================
// AUTENTICACIÓN
// ==========================================

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.password_hash, u.rol,
              e.id_estudiante, e.id_docente
       FROM usuarios u
       LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
       WHERE u.email = $1`,
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

    res.json({
      message: "Login exitoso",
      user: {
        id: user.id_usuario,
        id_estudiante: user.id_estudiante,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error("❌ Error en /login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==========================================
// GESTIÓN DE PROGRESO
// ==========================================

// GET: Obtener progreso de un estudiante en un curso
app.get("/api/progreso/:usuarioId/:cursoId", async (req, res) => {
  const { usuarioId, cursoId } = req.params;

  try {
    // Primero obtenemos el id_estudiante del usuario
    const estudianteResult = await pool.query(
      "SELECT id_estudiante FROM estudiantes WHERE id_usuario = $1",
      [usuarioId]
    );

    if (estudianteResult.rows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const idEstudiante = estudianteResult.rows[0].id_estudiante;

    // Obtener progreso del estudiante en el curso
    const progresoResult = await pool.query(
      `SELECT p.id_progreso, p.id_ejercicio, p.id_submodulo, p.dificultad, 
              p.completado, p.intentos, p.ultima_ejecucion
       FROM progreso p
       WHERE p.id_estudiante = $1 AND p.id_curso = $2
       ORDER BY p.ultima_ejecucion DESC`,
      [idEstudiante, cursoId]
    );

    res.json(progresoResult.rows);
  } catch (err) {
    console.error("❌ Error en GET /api/progreso:", err);
    res.status(500).json({ message: "Error al obtener progreso" });
  }
});

// POST: Crear nuevo registro de progreso
app.post("/api/progreso", async (req, res) => {
  const {
    id_estudiante,
    id_curso,
    id_submodulo,
    id_ejercicio,
    dificultad,
    completado,
    intentos,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO progreso (id_estudiante, id_curso, id_submodulo, id_ejercicio, 
                             dificultad, completado, intentos, ultima_ejecucion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id_progreso, completado, intentos`,
      [
        id_estudiante,
        id_curso,
        id_submodulo,
        id_ejercicio,
        dificultad,
        completado,
        intentos,
      ]
    );

    res.status(201).json({
      message: "Progreso registrado",
      id_progreso: result.rows[0].id_progreso,
      ...result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error en POST /api/progreso:", err);
    res.status(500).json({ message: "Error al guardar progreso" });
  }
});

// PUT: Actualizar registro de progreso existente
app.put("/api/progreso", async (req, res) => {
  const {
    id_estudiante,
    id_curso,
    id_submodulo,
    id_ejercicio,
    dificultad,
    completado,
    intentos,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE progreso 
       SET completado = $3, intentos = $4, ultima_ejecucion = NOW()
       WHERE id_estudiante = $1 AND id_curso = $2 AND id_submodulo = $5 
             AND dificultad = $6
       RETURNING id_progreso, completado, intentos`,
      [id_estudiante, id_curso, completado, intentos, id_submodulo, dificultad]
    );

    if (result.rows.length === 0) {
      // Si no existe, crear uno nuevo
      return await pool.query(
        `INSERT INTO progreso (id_estudiante, id_curso, id_submodulo, id_ejercicio, 
                               dificultad, completado, intentos, ultima_ejecucion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING id_progreso, completado, intentos`,
        [
          id_estudiante,
          id_curso,
          id_submodulo,
          id_ejercicio,
          dificultad,
          completado,
          intentos,
        ]
      );
    }

    res.json({
      message: "Progreso actualizado",
      id_progreso: result.rows[0].id_progreso,
      ...result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error en PUT /api/progreso:", err);
    res.status(500).json({ message: "Error al actualizar progreso" });
  }
});

// GET: Obtener estadísticas de un estudiante
app.get("/api/estadisticas/:usuarioId/:cursoId", async (req, res) => {
  const { usuarioId, cursoId } = req.params;

  try {
    const estudianteResult = await pool.query(
      "SELECT id_estudiante FROM estudiantes WHERE id_usuario = $1",
      [usuarioId]
    );

    if (estudianteResult.rows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const idEstudiante = estudianteResult.rows[0].id_estudiante;

    const statsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_ejercicios,
         SUM(CASE WHEN completado = true THEN 1 ELSE 0 END) as ejercicios_completados,
         AVG(intentos) as intentos_promedio,
         MAX(ultima_ejecucion) as ultima_actividad
       FROM progreso
       WHERE id_estudiante = $1 AND id_curso = $2`,
      [idEstudiante, cursoId]
    );

    res.json({
      total_ejercicios: parseInt(statsResult.rows[0].total_ejercicios),
      ejercicios_completados:
        parseInt(statsResult.rows[0].ejercicios_completados) || 0,
      intentos_promedio: parseFloat(statsResult.rows[0].intentos_promedio) || 0,
      ultima_actividad: statsResult.rows[0].ultima_actividad,
    });
  } catch (err) {
    console.error("❌ Error en GET /api/estadisticas:", err);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
});
// api-progreso.js - Rutas del backend para manejar el progreso


/**
 * GET /api/progreso/:idEstudiante/:idCurso
 * Obtiene todo el progreso de un estudiante en un curso específico
 */
router.get('/api/progreso/:idEstudiante/:idCurso', async (req, res) => {
  const { idEstudiante, idCurso } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        id_progreso,
        id_estudiante,
        id_ejercicio,
        id_curso,
        id_submodulo,
        dificultad,
        completado,
        intentos,
        ultima_ejecucion,
        error_tipo
      FROM progreso
      WHERE id_estudiante = $1 AND id_curso = $2
      ORDER BY id_submodulo, dificultad`,
      [idEstudiante, idCurso]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al cargar progreso:', error);
    res.status(500).json({ error: 'Error al cargar progreso' });
  }
});

/**
 * POST /api/progreso
 * Guarda o actualiza el progreso de un ejercicio
 */
router.post('/api/progreso', async (req, res) => {
  const {
    id_estudiante,
    id_ejercicio,
    id_curso,
    id_submodulo,
    dificultad,
    completado,
    intentos = 1,
    error_tipo = null
  } = req.body;

  try {
    // Verificar si ya existe un registro
    const existeResult = await pool.query(
      `SELECT id_progreso, intentos FROM progreso
       WHERE id_estudiante = $1 
       AND id_ejercicio = $2 
       AND id_curso = $3`,
      [id_estudiante, id_ejercicio, id_curso]
    );

    if (existeResult.rows.length > 0) {
      // ACTUALIZAR registro existente
      const progresoExistente = existeResult.rows[0];
      const nuevosIntentos = progresoExistente.intentos + 1;

      await pool.query(
        `UPDATE progreso
         SET completado = $1,
             intentos = $2,
             ultima_ejecucion = NOW(),
             error_tipo = $3,
             dificultad = $4,
             id_submodulo = $5
         WHERE id_progreso = $6`,
        [
          completado,
          nuevosIntentos,
          error_tipo,
          dificultad,
          id_submodulo,
          progresoExistente.id_progreso
        ]
      );

      res.json({ 
        mensaje: 'Progreso actualizado',
        intentos: nuevosIntentos
      });

    } else {
      // INSERTAR nuevo registro
      const result = await pool.query(
        `INSERT INTO progreso 
         (id_estudiante, id_ejercicio, id_curso, id_submodulo, dificultad, completado, intentos, error_tipo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id_progreso`,
        [
          id_estudiante,
          id_ejercicio,
          id_curso,
          id_submodulo,
          dificultad,
          completado,
          intentos,
          error_tipo
        ]
      );

      res.json({ 
        mensaje: 'Progreso guardado',
        id_progreso: result.rows[0].id_progreso
      });
    }

  } catch (error) {
    console.error('Error al guardar progreso:', error);
    res.status(500).json({ error: 'Error al guardar progreso' });
  }
});

/**
 * GET /api/progreso/:idEstudiante/:idCurso/estadisticas
 * Obtiene estadísticas del progreso del estudiante
 */
router.get('/api/progreso/:idEstudiante/:idCurso/estadisticas', async (req, res) => {
  const { idEstudiante, idCurso } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_ejercicios,
        SUM(CASE WHEN completado = true THEN 1 ELSE 0 END) as completados,
        SUM(intentos) as total_intentos,
        AVG(intentos) as promedio_intentos,
        COUNT(DISTINCT id_submodulo) as submodulos_iniciados
      FROM progreso
      WHERE id_estudiante = $1 AND id_curso = $2`,
      [idEstudiante, idCurso]
    );

    const estadisticas = result.rows[0];
    const porcentaje_completado = estadisticas.total_ejercicios > 0
      ? Math.round((estadisticas.completados / estadisticas.total_ejercicios) * 100)
      : 0;

    res.json({
      ...estadisticas,
      porcentaje_completado
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

/**
 * DELETE /api/progreso/:idEstudiante/:idCurso/reset
 * Resetea todo el progreso de un curso (útil para testing)
 */
router.delete('/api/progreso/:idEstudiante/:idCurso/reset', async (req, res) => {
  const { idEstudiante, idCurso } = req.params;

  try {
    await pool.query(
      'DELETE FROM progreso WHERE id_estudiante = $1 AND id_curso = $2',
      [idEstudiante, idCurso]
    );

    res.json({ mensaje: 'Progreso reseteado exitosamente' });
  } catch (error) {
    console.error('Error al resetear progreso:', error);
    res.status(500).json({ error: 'Error al resetear progreso' });
  }
});

module.exports = router;

app.listen(4000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:4000");
});