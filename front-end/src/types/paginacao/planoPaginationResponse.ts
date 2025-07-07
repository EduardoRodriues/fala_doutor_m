import type { Plano } from "../plano";

export interface PlanosPaginationResponse {
  data: Plano[];
  totalPaginas: number;
  totalItens: number;
  paginaAtual: number;
}
