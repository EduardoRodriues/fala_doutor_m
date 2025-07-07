export interface RelatorioMedicoPagination<T> {
  data: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
