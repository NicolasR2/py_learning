import curso1 from "../data/01_holamundo_basico.json";
import CursoTemplate from "../components/CursoTemplate";

function Cursos() {
  return <CursoTemplate curso={curso1} />;
}

export default Cursos;