import type { Plano } from "./plano";

export interface Medico {
  id: number;
  nome: string;
  cpf: string;
  crm: string;
  dataNasc: string;
  planos?: Plano[];
  planoIds: number[];
}