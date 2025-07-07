import axios from "axios";
import type { PacientePaginationResponse } from "../../../types/paginacao/pacientePaginationResponse";

export async function filtrolPacienteIdade(
  page = 1,
  limit = 10
): Promise<PacientePaginationResponse> {
  const response = await axios.get<PacientePaginationResponse>(
    `http://localhost:3003/relatorios/pacientes/idade?page=${page}&limit=${limit}`
  );

  return response.data;
}
