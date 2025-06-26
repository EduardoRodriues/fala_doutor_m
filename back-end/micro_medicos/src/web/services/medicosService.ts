import { MedicoDTO } from "./../types/medicoDTO";
import { prisma } from "../libs/prisma";
import { toForm } from "../mappers/medicoMapper";

export async function buscarMedicos(): Promise<MedicoDTO[]> {
  const medicos = await prisma.medico.findMany();
  return medicos.map(toForm);
}

export async function criarMedico(data: MedicoDTO) {
  const novoMedico = await prisma.medico.create({
    data,
  });
  return toForm(novoMedico);
}

export async function buscarPorId(id: number): Promise<MedicoDTO | null> {
  const medico = await prisma.medico.findUnique({
    where: { id: BigInt(id) },
  });

  if (!medico) {
    return null;
  }

  return toForm(medico);
}

export async function editarMedico(id: number, data: MedicoDTO) {
  const medicoExiste = await buscarPorId(id);

  if (!medicoExiste) {
    return null;
  }

  const medicoAtualizado = await prisma.medico.update({
    where: { id: BigInt(id) },
    data: {
      nome: data.nome,
      cpf: data.cpf,
      crm: data.crm,
    },
  });

  return toForm(medicoAtualizado);
}

export async function deletarMedico(id: number) {
  const medicoExiste = await buscarPorId(id);

  if (!medicoExiste) {
    return null;
  }

  await prisma.medico.delete({
    where: { id: BigInt(id) },
  });
}