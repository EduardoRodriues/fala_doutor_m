import { prisma } from "../libs/prisma";
import { MedicoDTO } from "../types/medicoDTO";
import { MedicoResponseDTO } from "../types/medicoResponseDTO";
import { toForm } from "../mappers/medicoMapper";
import fetch from "node-fetch";
import axios from "axios";

export async function listarMedicos(): Promise<MedicoResponseDTO[]> {
  const medicos = await prisma.medico.findMany({
    include: { planos: true },
  });
  return medicos.map(toForm);
}

export async function buscarPorId(
  id: bigint
): Promise<MedicoResponseDTO | null> {
  const medico = await prisma.medico.findUnique({
    where: { id },
    include: { planos: true },
  });
  if (!medico) return null;
  return toForm(medico);
}

export async function criarMedico(data: MedicoDTO, planoIds: bigint[] = []) {
  if (!(await validarPlanosExistem(planoIds))) {
    throw new Error("Um ou mais planos não existem");
  }

  const novoMedico = await prisma.medico.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
      crm: data.crm,
      planos: {
        create: planoIds.map((planoId) => ({
          planoId,
        })),
      },
    },
    include: { planos: true },
  });
  return toForm(novoMedico);
}

export async function editarMedico(
  id: bigint,
  data: MedicoDTO,
  planoIds: bigint[]
) {
  const medicoAtual = await prisma.medico.findUnique({
    where: { id },
    include: { planos: true },
  });
  if (!medicoAtual) return null;

  await prisma.medicoPlano.deleteMany({
    where: { medicoId: id },
  });

  const medicoAtualizado = await prisma.medico.update({
    where: { id },
    data: {
      nome: data.nome,
      cpf: data.cpf,
      crm: data.crm,
      planos: {
        create: planoIds.map((planoId) => ({
          planoId,
        })),
      },
    },
    include: { planos: true },
  });

  return toForm(medicoAtualizado);
}

export async function deletarMedico(id: bigint) {
  await prisma.medicoPlano.deleteMany({ where: { medicoId: id } });
  await prisma.medico.delete({ where: { id } });
}

async function validarPlanosExistem(planoIds: bigint[]): Promise<boolean> {
  const { data: planos } = await axios.get("http://localhost:3002/planos");
  const idsExistentes = planos.map((p: any) => BigInt(p.id));
  return planoIds.every((id) => idsExistentes.includes(id));
}
