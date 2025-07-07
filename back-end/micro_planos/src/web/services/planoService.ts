import { prisma } from "./../libs/prisma";
import { toForm } from "../mappers/planoMapper";
import { PlanoDTO } from "../../core/validations/planoDTOvalidation";
import { Decimal } from "@prisma/client/runtime/library";
import { PlanoPaginationResponse } from "../types/planoPaginationResponse";

export async function buscarPlanosPaginado(
  page: number,
  limit: number
): Promise<PlanoPaginationResponse<PlanoDTO>> {
  const skip = (page - 1) * limit;

  const [total, planos] = await Promise.all([
    prisma.plano.count(),
    prisma.plano.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const data = await Promise.all(planos.map(toForm));

  return {
    data,
    paginaAtual: page,
    totalPaginas: Math.ceil(total / limit),
    totalItens: total,
  };
}

export async function cadastrarPlano(data: PlanoDTO) {
  const novoPlano = await prisma.plano.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      preco: new Decimal(data.preco),
    },
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
