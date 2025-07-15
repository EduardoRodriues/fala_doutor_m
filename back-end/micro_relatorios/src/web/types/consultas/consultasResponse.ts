interface ConsultasResponse {
  data: {
    id: string;
    medicoNome:string
    pacienteNome: string
    dataConsulta: string;
  }[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}