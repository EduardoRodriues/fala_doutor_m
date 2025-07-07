export interface PlanoPaginationResponse<T> {
  data: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
