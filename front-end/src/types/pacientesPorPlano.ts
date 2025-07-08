export interface PacientesPorPlano {
  planoId: string;
  pacientes: Array<{
    id: string;
    nome: string;
    cpf: string;
    dataNasc: string;
    planoId: string;
  }>;
}
