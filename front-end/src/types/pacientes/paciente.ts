import type { Plano } from "../planos/plano";

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNasc: string;
  planoId: number;
  plano?: Plano;
}