import type { Plano } from "./plano";

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNasc: string;
  planoId: number;
  plano?: Plano;
}