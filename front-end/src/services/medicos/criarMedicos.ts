import type { Medico } from "../../types/medico";
import axios from "axios";

export async function criarMedico(medico: Medico) {
  const response = await axios.post<Medico>(
    "http://localhost:3000/medicos",
    medico
  );
  return response.data;
}
