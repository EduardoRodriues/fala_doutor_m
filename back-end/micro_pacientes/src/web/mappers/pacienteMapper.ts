import { Paciente } from "@prisma/client";
import { PacienteDTO } from "../types/pacienteDTO";
import { PacienteResponseDTO } from "../types/pacienteResponseDTO";

export function toForm(paciente: Paciente): PacienteResponseDTO {
  return {
    id: paciente.id.toString(),
    nome: paciente.nome,
    cpf: paciente.cpf,
    dataNasc: paciente.dataNasc,
    planoId: paciente.planoId.toString()
  };
}

export function toModel(pacienteDTO: PacienteDTO): Partial<Paciente> {
  return {
    nome: pacienteDTO.nome,
    cpf: pacienteDTO.cpf,
    dataNasc: pacienteDTO.dataNasc,
    planoId: BigInt(pacienteDTO.planoId),
  };
}

