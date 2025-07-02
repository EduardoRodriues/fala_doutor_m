import * as medicoService from "../services/medicosService";
import { Request, Response } from "express";

export async function listarMedicos(req: Request, res: Response) {
  const lista = await medicoService.listarMedicos();
  res.status(200).json(lista);
}

export async function cadastrarMedico(req: Request, res: Response) {
  const { planoIds = [], ...medicoData } = req.body;
  const planoIdsBigInt = planoIds.map((id: number | string) => BigInt(id));

  const medicoNovo = await medicoService.criarMedico(
    medicoData,
    planoIdsBigInt
  );
  res.status(201).json({
    message: "Médico cadastrado com sucesso!",
    medico: medicoNovo,
  });
}

export async function buscarPorId(req: Request, res: Response) {
  const medicoId = BigInt(req.params.id);
  const medico = await medicoService.buscarPorId(medicoId);

  if (!medico) {
    return res.status(404).json({ message: "Médico não encontrado." });
  }

  res.status(200).json(medico);
}

export async function atualizarMedico(req: Request, res: Response) {
  const medicoId = BigInt(req.params.id);
  const { planoIds = [], ...medicoData } = req.body;
  const planoIdsBigInt = planoIds.map((id: number | string) => BigInt(id));

  const medicoNovo = await medicoService.editarMedico(
    medicoId,
    medicoData,
    planoIdsBigInt
  );

  if (!medicoNovo) {
    return res.status(404).json({ message: "Médico não encontrado." });
  }

  res.status(200).json({
    message: "Médico editado com sucesso!",
    medico: medicoNovo,
  });
}

export async function deletarMedico(req: Request, res: Response) {
  const medicoId = BigInt(req.params.id);
  await medicoService.deletarMedico(medicoId);

  res.status(200).json({
    message: "Médico removido com sucesso!",
  });
}
