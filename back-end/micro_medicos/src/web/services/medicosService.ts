import axios from "axios";
import { prisma } from "../libs/prisma";
import { MedicoDTO } from "../types/medicoDTO";
import { toForm } from "../mappers/medicoMapper";
import dayjs from "dayjs";
import { MedicoResponseDTO } from "../types/medicoResponseDTO";
import { MedicoPaginationResponse } from "../types/medicoPaginationResponse";

async function validarPlanoExiste(planoId: bigint): Promise<boolean> {
  try {
    const response = await axios.get(
      `http://localhost:3002/planos/${planoId.toString()}`
    );
    return response.status === 200 && response.data !== null;
  } catch {
    return false;
  }
}

export async function buscarMedicosPaginado(
  page: number,
  limit: number
): Promise<MedicoPaginationResponse<MedicoResponseDTO>> {
  const skip = (page - 1) * limit;

  const [total, medicos] = await Promise.all([
    prisma.medico.count(),
    prisma.medico.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
      include: { planos: true },
    }),
  ]);

  const data = await Promise.all(medicos.map(toForm));

  return {
    data,
    paginaAtual: page,
    totalPaginas: Math.ceil(total / limit),
    totalItens: total,
  };
}

export async function cadastrarMedico(
  data: MedicoDTO & { planoIds: string[] }
): Promise<MedicoDTO> {
  const dataNasc = dayjs(data.dataNasc, "DDMMYYYY", true);

  if (!dataNasc.isValid()) {
    throw new Error("Data de nascimento inválida");
  }

  for (const planoIdStr of data.planoIds) {
    const planoId = BigInt(planoIdStr);
    const existe = await validarPlanoExiste(planoId);
    if (!existe) {
      throw new Error(`Plano com id ${planoId} não existe.`);
    }
  }

  const novoMedico = await prisma.medico.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
      crm: data.crm,
      dataNasc: dataNasc.toDate(),
    },
  });

  const relacoes = data.planoIds.map((planoId) => ({
    medicoId: novoMedico.id,
    planoId: BigInt(planoId),
  }));

  await prisma.medicoPlano.createMany({
    data: relacoes,
  });

  const medicoComPlanos = await prisma.medico.findUnique({
    where: { id: novoMedico.id },
    include: { planos: true },
  });

  return toForm(medicoComPlanos);
}

export async function buscarPorId(id: number): Promise<MedicoDTO | null> {
  const medico = await prisma.medico.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      planos: true,
    },
  });

  if (!medico) {
    return null;
  }

  return toForm(medico);
}

export async function editarMedico(
  id: number,
  data: MedicoDTO & { planoIds: string[] }
): Promise<MedicoDTO | null> {
  const dataNasc = dayjs(data.dataNasc, "DDMMYYYY", true);

  if (!dataNasc.isValid()) {
    throw new Error("Data de nascimento inválida");
  }

  const medicoExistente = await buscarPorId(id);

  if (!medicoExistente) {
    return null;
  }

  for (const planoIdStr of data.planoIds) {
    const planoId = BigInt(planoIdStr);
    const existe = await validarPlanoExiste(planoId);
    if (!existe) {
      throw new Error(`Plano com id ${planoId} não existe.`);
    }
  }

  await prisma.medico.update({
    where: { id: BigInt(id) },
    data: {
      nome: data.nome,
      cpf: data.cpf,
      crm: data.crm,
      dataNasc: dataNasc.toDate(),
    },
  });

  await prisma.medicoPlano.deleteMany({
    where: { medicoId: BigInt(id) },
  });

  const relacoes = data.planoIds.map((planoId) => ({
    medicoId: BigInt(id),
    planoId: BigInt(planoId),
  }));

  await prisma.medicoPlano.createMany({
    data: relacoes,
  });

  const medicoAtualizado = await prisma.medico.findUnique({
    where: { id: BigInt(id) },
    include: { planos: true },
  });

  return toForm(medicoAtualizado);
}

export async function deletarMedico(id: number): Promise<MedicoDTO | null> {
  const medico = await buscarPorId(id);

  if (!medico) {
    return null;
  }

  await prisma.medicoPlano.deleteMany({
    where: { medicoId: BigInt(id) },
  });

  await prisma.medico.delete({
    where: { id: BigInt(id) },
  });

  return medico;
}
