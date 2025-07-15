import type { Plano } from "../planos/plano";

export interface Medico {
  id: number;
  nome: string;
  cpf: string;
  crm: string;
  dataNasc: string;
  planos?: Plano[];
  planoIds: number[];
}