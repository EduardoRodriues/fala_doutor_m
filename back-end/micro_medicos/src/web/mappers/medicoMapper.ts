import { Medico } from "@prisma/client"
import { MedicoDTO } from "../types/medicoDTO";
import { MedicoResponseDTO } from "../types/medicoResponseDTO";

export function toForm(medico: Medico): MedicoResponseDTO {
  return {
    id: medico.id.toString(),
    nome: medico.nome,
    cpf: medico.cpf,
    crm: medico.crm,
  };
}

export function toModel(medicoDTO: MedicoDTO): Partial<Medico> {
  return {
    nome: medicoDTO.nome,
    cpf: medicoDTO.cpf,
    crm: medicoDTO.crm,
  };
}
