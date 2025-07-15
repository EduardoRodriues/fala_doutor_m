import axios from "axios";
import type { Paciente } from "../../types/pacientes/paciente";
import type { PacientePaginationResponse } from "../../types/pacientes/paginacao/pacientePaginationResponse";

export async function listarPacientes(page = 1, limit = 10) {
  const response = await axios.get<PacientePaginationResponse>(
    `http://localhost:3001/pacientes?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function criarPaciente(paciente: Paciente) {
  const response = await axios.post<Paciente>(
    "http://localhost:3001/pacientes",
    paciente
  );
  return response.data;
}

export async function editarPaciente(paciente: Paciente) {
  const response = await axios.put<Paciente>(
    `http://localhost:3001/pacientes/${paciente.id}`,
    paciente
  );
  return response.data;
}

export async function deletarPaciente(id: number) {
  const response = await axios.delete<Paciente>(
    `http://localhost:3001/pacientes/${id}`
  );
  return response.data;
}
