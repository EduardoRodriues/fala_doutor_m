import type { Medico } from "../medico";

export interface MedicoPaginationResponse {
  data: Medico[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
