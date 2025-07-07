import axios from "axios";
import type { MedicoPaginationResponse } from "../../types/paginacao/medicoPaginationResponse";

export async function listarMedicos(
  page = 1,
  limit = 10
): Promise<MedicoPaginationResponse> {
  const response = await axios.get<MedicoPaginationResponse>(
    `http://localhost:3000/medicos?page=${page}&limit=${limit}`
  );
  return response.data;
}
