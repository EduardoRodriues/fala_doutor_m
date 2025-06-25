import * as medicoService from "../services/medicosService";
import { Request, Response } from "express";

export async function listarMedicos(req: Request, res: Response) {
  const lista = await medicoService.buscarMedicos();
  res.status(200).json(lista);
}

export async function cadastrarMedico(req: Request, res: Response) {
  const medicoNovo = await medicoService.criarMedico(req.body);
  res.status(201).json({
    message: "Médico cadastrado com sucesso!",
    medico: medicoNovo,
  });
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  const medicoId = Number(req.params.id);
  const medico = await medicoService.buscarPorId(medicoId);

  if (!medico) {
    res.status(404).json({ message: "Médico não encontrado." });
    return;
  }

  res.status(200).json(medico);
}

export async function atualizarMedico(
  req: Request,
  res: Response
): Promise<void> {
  console.log("Corpo da requisição (req.body):", req.body);
  const medicoId = Number(req.params.id);
  const medicoData = req.body;

  const medicoNovo = await medicoService.editarMedico(medicoId, medicoData);

  if (!medicoNovo) {
    res.status(404).json({ message: "Médico não encontrado." });
    return;
  }

  res.status(200).json({
    message: "Médico editado com sucesso!",
    medico: medicoNovo,
  });
}

export async function deletarMedico(req: Request, res: Response) {
  const medicoId = Number(req.params.id);
  await medicoService.deletarMedico(medicoId);

  res.status(200).json({
    message: "Médico removido com sucesso!",
  });
}
