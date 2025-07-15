import { prisma } from "../libs/prisma";
import { ConsultaDTO } from "../types/consultaDTO";
import { ConsultaPaginationResponse } from "../types/consultaPaginationResponse";
import { ConsultaResponseDTO } from "../types/consultaResponseDTO";
import axios from "axios";
import { MedicoDTO } from "../types/medicoDTO";
import { PacienteDTO } from "../types/pacienteDTO";

export async function buscarConsultasPaginado(
  page: number,
  limit: number
): Promise<
  ConsultaPaginationResponse<
    ConsultaResponseDTO & {
      medicoNome: string;
      pacienteNome: string;
      medicoPlano: string[];
      pacientePlano: string;
    }
  >
> {
  const skip = (page - 1) * limit;

  const [total, consultas] = await Promise.all([
    prisma.consulta.count(),
    prisma.consulta.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const data = await Promise.all(
    consultas.map(async (consulta) => {
      const responseMedico = await axios.get<MedicoDTO>(
        `http://localhost:3000/medicos/${consulta.medicoId}`
      );
      const responsePaciente = await axios.get<PacienteDTO>(
        `http://localhost:3001/pacientes/${consulta.pacienteId}`
      );

      const medicoNome = responseMedico.data.nome;
      const pacienteNome = responsePaciente.data.nome;

      return {
        id: consulta.id.toString(),
        medicoId: consulta.medicoId.toString(),
        pacienteId: consulta.pacienteId.toString(),
        dataConsulta: consulta.dataConsulta,
        medicoNome,
        pacienteNome,
        medicoPlano: responseMedico.data.planoIds,
        pacientePlano: responsePaciente.data.planoId,
      }as ConsultaResponseDTO & {
        medicoNome: string;
        pacienteNome: string;
        medicoPlano: string[];
        pacientePlano: string;
      };
    })
  );

  return {
    data,
    paginaAtual: page,
    totalPaginas: Math.ceil(total / limit),
    totalItens: total,
  };
}

export async function cadastrarConsulta(
  data: ConsultaDTO
): Promise<ConsultaResponseDTO> {
  await validarCredenciais(data.medicoId, data.pacienteId);

  const novaConsulta = await prisma.consulta.create({
    data: {
      medicoId: BigInt(data.medicoId),
      pacienteId: BigInt(data.pacienteId),
      dataConsulta: data.dataConsulta,
    },
  });

  return {
    id: novaConsulta.id.toString(),
    medicoId: novaConsulta.medicoId.toString(),
    pacienteId: novaConsulta.pacienteId.toString(),
    dataConsulta: novaConsulta.dataConsulta,
  };
}

export async function buscarConsultaPorId(
  id: number
): Promise<ConsultaResponseDTO | null> {
  const consulta = await prisma.consulta.findUnique({
    where: { id: Number(id) },
  });

  if (!consulta) {
    throw new Error("Consulta não encontrada");
  }

  return {
    id: consulta.id.toString(),
    medicoId: consulta.medicoId.toString(),
    pacienteId: consulta.pacienteId.toString(),
    dataConsulta: consulta.dataConsulta,
  };
}

export async function editarConsulta(
  id: number,
  data: ConsultaDTO
): Promise<ConsultaResponseDTO> {
  await validarCredenciais(data.medicoId, data.pacienteId);

  const consultaAtualizada = await prisma.consulta.update({
    where: { id: Number(id) },
    data: {
      medicoId: BigInt(data.medicoId),
      pacienteId: BigInt(data.pacienteId),
      dataConsulta: data.dataConsulta,
    },
  });

  return {
    id: consultaAtualizada.id.toString(),
    medicoId: consultaAtualizada.medicoId.toString(),
    pacienteId: consultaAtualizada.pacienteId.toString(),
    dataConsulta: consultaAtualizada.dataConsulta,
  };
}

export async function deletarConsulta(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id: Number(id) },
  });

  if (!consulta) {
    return null;
  }

  await prisma.consulta.delete({
    where: { id: Number(id) },
  });
}

async function validarCredenciais(
  medicoId: string | bigint,
  pacienteId: string | bigint
): Promise<void> {
  const responseMedico = await axios.get<MedicoDTO>(
    `http://localhost:3000/medicos/${medicoId.toString()}`
  );
  const medico = responseMedico.data;

  if (!medico) {
    throw new Error("Médico não encontrado");
  }

  const responsePaciente = await axios.get<PacienteDTO>(
    `http://localhost:3001/pacientes/${pacienteId.toString()}`
  );
  const paciente = responsePaciente.data;

  if (!paciente) {
    throw new Error("Paciente não encontrado");
  }

  const planosMedico = medico.planoIds || [];
  const planoPaciente = paciente.planoId;

  if (!planosMedico.includes(planoPaciente)) {
    throw new Error("O plano do paciente não é aceito pelo médico");
  }
}
