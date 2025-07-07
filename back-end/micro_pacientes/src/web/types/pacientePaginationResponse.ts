export interface PacientePaginationResponse<T> {
  data: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
