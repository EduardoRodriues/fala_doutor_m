export interface MedicoPaginationResponse<T> {
  data: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
