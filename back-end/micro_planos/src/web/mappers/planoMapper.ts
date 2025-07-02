import { PlanoDTO } from "../../core/validations/planoDTOvalidation";
import { Plano } from "../../core/generated/prisma";
import { PlanoResponseDTO } from "../types/planoResponseDTO";
import { Decimal } from "@prisma/client/runtime/library";

export function toForm(plano: Plano): PlanoResponseDTO {
  return {
    id: plano.id.toString(),
    nome: plano.nome,
    descricao: plano.descricao,
    preco: plano.preco.toString(),
  };
}

export function toModel(planoDTO: PlanoDTO): Partial<Plano> {
  return {
    nome: planoDTO.nome,
    descricao: planoDTO.descricao,
    preco: new Decimal(planoDTO.preco),
  };
}
