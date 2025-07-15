import type { Medico } from "../../types/medicos/medico";
import axios from "axios";
import type { MedicoPaginationResponse } from "../../types/medicos/paginacao/medicoPaginationResponse";

export async function listarMedicos(
  page = 1,
  limit = 10
): Promise<MedicoPaginationResponse> {
  const response = await axios.get<MedicoPaginationResponse>(
    `http://localhost:3000/medicos?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function criarMedico(medico: Medico) {
  const response = await axios.post<Medico>(
    "http://localhost:3000/medicos",
    medico
  );
  return response.data;
}

export async function editarMedico(medico: Medico) {
  const response = await axios.put(
    `http://localhost:3000/medicos/${medico.id}`,
    medico
  );
  return response.data;
}

export async function deletarMedico(id: number) {
  const response = await axios.delete<Medico>(
    `http://localhost:3000/medicos/${id}`
  );
  return response.data;
}
