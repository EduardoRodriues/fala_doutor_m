import type { Medico } from "../../types/medico";
import axios from "axios";

export async function deletarMedico(id: number) {
  const response = await axios.delete<Medico>(
    `http://localhost:3000/medicos/${id}`
  );
  return response.data;
}
