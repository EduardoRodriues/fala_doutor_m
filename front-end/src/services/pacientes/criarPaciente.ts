import axios from "axios";
import type { Paciente } from "../../types/paciente";

export async function criarPaciente(paciente: Paciente) {
  const response = await axios.post<Paciente>(
    "http://localhost:3001/pacientes",
    paciente
  );
  return response.data;
}
