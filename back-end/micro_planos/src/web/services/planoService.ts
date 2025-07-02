import { prisma } from "../libs/prisma";
import { toForm } from "../mappers/planoMapper";
import { PlanoDTO } from "../../core/validations/planoDTOvalidation";
import { Decimal } from "@prisma/client/runtime/library";

export async function buscarPlanos(): Promise<PlanoDTO[]> {
  const planos = await prisma.plano.findMany();
  return planos.map(toForm);
}

export async function cadastrarPlano(data: PlanoDTO) {
  const novoPlano = await prisma.plano.create({
    data,
  });

  return toForm(novoPlano);
}

export async function buscarPorId(id: number) {
  const plano = await prisma.plano.findUnique({
    where: {
      id: BigInt(id),
    },
  });

  if (!plano) {
    return null;
  }

  return toForm(plano);
}

export async function editarPlano(id: number, data: PlanoDTO) {
  const plano = await buscarPorId(id);

  if (!plano) {
    return null;
  }

  const planoEditado = await prisma.plano.update({
    where: { id: BigInt(id) },
    data: {
      nome: data.nome,
      descricao: data.descricao,
      preco: new Decimal(data.preco),
    },
  });

  return toForm(planoEditado);
}

export async function deletarPlano(id: number) {
  const plano = await buscarPorId(id);

  if (!plano) {
    return null;
  }

  return await prisma.plano.delete({
    where: { id: BigInt(id) },
  });
}
