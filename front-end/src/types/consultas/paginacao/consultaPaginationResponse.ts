import type { Consulta } from "../consulta";

export interface ConsultaPaginationResponse {
  data: Consulta[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
