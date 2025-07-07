export interface RelatorioPlanoPagination<T> {
  data: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
