import type { ConsultaPorMedico } from "../consultaPorMedico";

export interface RelatorioConsultaPaginationResponse {
  data: ConsultaPorMedico[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}