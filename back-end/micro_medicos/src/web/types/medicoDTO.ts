export interface MedicoDTO {
  nome: string;
  cpf: string;
  crm: string;
  dataNasc: Date;
  planoIds: string[];
  planos: any[];
}
