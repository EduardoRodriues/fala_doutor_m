import type { PacientePaginationResponse } from "../../types/paginacao/pacientePaginationResponse";
import axios from "axios";

export async function listarPacientes(page = 1, limit = 10) {
  const response = await axios.get<PacientePaginationResponse>(
    `http://localhost:3001/pacientes?page=${page}&limit=${limit}`
  );
  return response.data;
}
