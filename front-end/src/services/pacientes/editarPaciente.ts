import axios from "axios";
import type { Paciente } from "../../types/paciente";

export async function editarPaciente(paciente: Paciente) {
  const response = await axios.put<Paciente>(
    `http://localhost:3001/pacientes/${paciente.id}`,
    paciente
  );
  return response.data;
}
