import { useParams } from "react-router-dom";
import CursoTemplate from "../components/CursoTemplate";

// Importa todos los cursos
import curso1 from "../data/test1.json";

// y así sucesivamente...

const cursosMap = {
  1: curso1,
  // agrega más aquí
};

export default function CursoLoader() {
  const { id } = useParams();
  const curso = cursosMap[id];

  if (!curso) return <h1>Curso no encontrado</h1>;

  return <CursoTemplate curso={curso} />;
}
