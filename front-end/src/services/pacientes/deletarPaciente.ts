import axios from "axios";
import type { Paciente } from "../../types/paciente";

export async function deletarPaciente(id: number) {
  const response = await axios.delete<Paciente>(
    `http://localhost:3001/pacientes/${id}`
  );
  return response.data;
}
