import type { Medico } from "../../types/medico";
import axios from "axios";

export async function editarMedico(medico: Medico) {
  const response = await axios.put(
    `http://localhost:3000/medicos/${medico.id}`,
    medico
  );
  return response.data;
}
