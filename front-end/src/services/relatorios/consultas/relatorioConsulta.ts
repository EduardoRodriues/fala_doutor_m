import axios from "axios";
import type { RelatorioConsultaPaginationResponse } from "../../../types/relatorios/paginacao/consultaRelatorioPaginationResponse";

export async function gerarRelatorioConsulta(
  page = 1,
  limit = 10
): Promise<RelatorioConsultaPaginationResponse> {
  const response = await axios.get<RelatorioConsultaPaginationResponse>(
    `http://localhost:3003/relatorios/consultas?page=${page}&limit=${limit}`
  );

  return response.data;
}
