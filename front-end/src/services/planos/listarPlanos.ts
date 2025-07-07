import type { PlanosPaginationResponse } from "../../types/paginacao/planoPaginationResponse";
import axios from "axios";

export async function listarPlanos(
  page = 1,
  limit = 10
): Promise<PlanosPaginationResponse> {
  const response = await axios.get<PlanosPaginationResponse>(
    `http://localhost:3002/planos?page=${page}&limit=${limit}`
  );
  return response.data;
}
