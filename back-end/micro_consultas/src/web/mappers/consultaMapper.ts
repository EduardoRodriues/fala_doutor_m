import { Consulta } from "@prisma/client";
import { ConsultaDTO } from "../types/consultaDTO";
import { ConsultaResponseDTO } from "../types/consultaResponseDTO";
import axios from "axios";
import { MedicoDTO } from "../types/medicoDTO";
import { PacienteDTO } from "../types/pacienteDTO";

export async function toForm(
  consulta: Consulta
): Promise<
  ConsultaResponseDTO & {
    medicoNome: string;
    pacienteNome: string;
    medicoPlano: string;
    pacientePlano: string;
  }
> {
  const [medicoResponse, pacienteResponse] = await Promise.all([
    axios.get<MedicoDTO>(
      `http://localhost:3000/medicos/${consulta.medicoId.toString()}`
    ),
    axios.get<PacienteDTO>(
      `http://localhost:3001/pacientes/${consulta.pacienteId.toString()}`
    ),
  ]);

  const medico = medicoResponse.data;
  const paciente = pacienteResponse.data;

  return {
    id: consulta.id.toString(),
    medicoId: consulta.medicoId.toString(),
    pacienteId: consulta.pacienteId.toString(),
    dataConsulta: consulta.dataConsulta,
    medicoNome: medico.nome,
    pacienteNome: paciente.nome,
    medicoPlano: medico.planoIds.toString(),
    pacientePlano: paciente.planoId,
  };
}

export function toModel(consultaDTO: ConsultaDTO): Partial<Consulta> {
  return {
    medicoId: BigInt(consultaDTO.medicoId),
    pacienteId: BigInt(consultaDTO.pacienteId),
    dataConsulta: consultaDTO.dataConsulta,
  };
}
