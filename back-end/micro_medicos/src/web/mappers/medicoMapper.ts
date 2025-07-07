import { Medico } from "@prisma/client";
import { MedicoDTO } from "../types/medicoDTO";
import { MedicoResponseDTO } from "../types/medicoResponseDTO";

import axios from "axios";

export async function toForm(medico: any): Promise<MedicoResponseDTO> {
  const planoIds = medico.planos.map((p: any) => p.planoId);

  const planosDetalhados = await Promise.all(
    planoIds.map(async (id: bigint) => {
      try {
        const res = await axios.get(
          `http://localhost:3002/planos/${id.toString()}`
        );
        return res.data;
      } catch {
        return null;
      }
    })
  );

  return {
    id: medico.id.toString(),
    nome: medico.nome,
    cpf: medico.cpf,
    crm: medico.crm,
    dataNasc: medico.dataNasc,
    planoIds: planoIds.map((id: bigint) => id.toString()),
    planos: planosDetalhados.filter((p) => p !== null),
  };
}

export function toModel(medicoDTO: MedicoDTO): Partial<Medico> {
  return {
    nome: medicoDTO.nome,
    cpf: medicoDTO.cpf,
    crm: medicoDTO.crm,
    dataNasc: medicoDTO.dataNasc,
  };
}
