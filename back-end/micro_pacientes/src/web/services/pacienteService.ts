import { prisma } from "../libs/prisma";
import { toForm } from "../mappers/pacienteMapper";
import { PacienteDTO } from "../types/pacienteDTO";
import { PacientePaginationResponse } from "../types/pacientePaginationResponse";

export async function buscarPacientesPaginado(
  page: number,
  limit: number
): Promise<PacientePaginationResponse<PacienteDTO>> {
  const skip = (page - 1) * limit;

  const [total, pacientes] = await Promise.all([
    prisma.paciente.count(),
    prisma.paciente.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const data = await Promise.all(pacientes.map(toForm));

  return {
    data,
    paginaAtual: page,
    totalPaginas: Math.ceil(total / limit),
    totalItens: total,
  };
}

export async function criarPaciente(data: PacienteDTO) {
  const novoPaciente = await prisma.paciente.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
      dataNasc: new Date(data.dataNasc),
      planoId: BigInt(data.planoId),
    },
  });
  return toForm(novoPaciente);
}

export async function buscarPorId(id: number): Promise<PacienteDTO | null> {
  const paciente = await prisma.paciente.findUnique({
    where: { id: BigInt(id) },
  });

  if (!paciente) {
    return null;
  }

  return toForm(paciente);
}

export async function editarPaciente(id: number, data: PacienteDTO) {
  const pacienteId = await buscarPorId(id);

  if (!pacienteId) return null;

  const pacienteNovo = await prisma.paciente.update({
    where: { id: BigInt(id) },
    data: {
      nome: data.nome,
      cpf: data.cpf,
      dataNasc: new Date(data.dataNasc),
      planoId: BigInt(data.planoId),
    },
  });

  return toForm(pacienteNovo);
}

export async function deletarPaciente(id: number) {
  const paciente = await buscarPorId(id);

  if (!paciente) {
    return null;
  }

  await prisma.paciente.delete({
    where: { id: BigInt(id) },
  });
}
