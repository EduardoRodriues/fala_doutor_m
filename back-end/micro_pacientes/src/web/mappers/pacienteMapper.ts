import axios from "axios";
import { Paciente } from "@prisma/client";
import { PacienteDTO } from "../types/pacienteDTO";
import { PacienteResponseDTO } from "../types/pacienteResponseDTO";
import { PlanoDTO } from "../types/planoDTO";

export async function toForm(
  paciente: Paciente
): Promise<PacienteResponseDTO & { planoNome: string }> {
  const response = await axios.get<PlanoDTO>(
    `http://localhost:3002/planos/${paciente.planoId.toString()}`
  );

  const plano = response.data;

  return {
    id: paciente.id.toString(),
    nome: paciente.nome,
    cpf: paciente.cpf,
    dataNasc: paciente.dataNasc,
    planoId: paciente.planoId.toString(),
    planoNome: plano.nome,
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
