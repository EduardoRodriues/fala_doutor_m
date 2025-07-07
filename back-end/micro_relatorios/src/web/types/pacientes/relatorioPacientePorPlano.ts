import { RelatorioPaciente } from "./relatorioPaciente";

export interface PacientesPorPlano {
  planoId: number;
  planoNome: string;
  pacientes: RelatorioPaciente[];
}
