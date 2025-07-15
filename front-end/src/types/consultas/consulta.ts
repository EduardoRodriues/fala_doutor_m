export interface Consulta {
  id: number;
  medicoId: number;
  medicoNome?: string;
  pacienteNome?: string;
  pacienteId: number;
  dataConsulta: string;
}
