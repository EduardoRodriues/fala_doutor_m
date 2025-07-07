import axios from "axios";
import type { PlanosPaginationResponse } from "../../../types/paginacao/planoPaginationResponse";

export async function filtroPrecoPlano(
  page = 1,
  limit = 10,
  preco: number
): Promise<PlanosPaginationResponse> {
  const response = await axios.get<PlanosPaginationResponse>(
    `http://localhost:3003/relatorios/planos?preco=${preco}&page=${page}&limit=${limit}`
  );

  return response.data;
}
