import { prisma } from "../libs/prisma";
import { toForm } from "../mappers/pacienteMapper";
import { PacienteDTO } from "../types/pacienteDTO";

export async function buscarPacientes(): Promise<PacienteDTO[]> {
  const lista = await prisma.paciente.findMany();
  return lista.map(toForm);
}

export async function criarPaciente(data: PacienteDTO) {
  const novoPaciente = await prisma.paciente.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
      dataNasc: data.dataNasc,
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
      dataNasc: data.dataNasc,
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
