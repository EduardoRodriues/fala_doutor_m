import type { Paciente } from "../paciente";

export interface PacientePaginationResponse {
  data: Paciente[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
