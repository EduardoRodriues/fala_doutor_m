import { RelatorioPaciente } from "./relatorioPaciente";

export interface PacientesPorPlano {
  planoNome: string;
  pacientes: RelatorioPaciente[];
}
