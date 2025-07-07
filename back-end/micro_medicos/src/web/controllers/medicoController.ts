import * as medicoService from "../services/medicosService";
import { Request, Response } from "express";

export async function listarMedicos(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await medicoService.buscarMedicosPaginado(page, limit);
  res.status(200).json(lista);
}

export async function cadastrarMedico(req: Request, res: Response) {
  const medicoNovo = await medicoService.cadastrarMedico(req.body);
  res.status(201).json({
    medico: medicoNovo,
    message: "Médico cadastrado com sucesso!",
  });
}

export async function buscarMedicoPorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  const medico = await medicoService.buscarPorId(id);

  if (!medico) {
    res.status(404).json({ message: "Médico não encontrado." });
    return;
  }

  res.status(200).json(medico);
}

export async function atualizarMedico(req: Request, res: Response) {
  const medicoId = Number(req.params.id);
  const medicoData = req.body;

  const medicoAtualizado = await medicoService.editarMedico(
    medicoId,
    medicoData
  );

  if (!medicoAtualizado) {
    res.status(404).json({ message: "Médico não encontrado." });
    return;
  }

  res.status(200).json({
    message: "Médico editado com sucesso!",
    medico: medicoAtualizado,
  });
}

export async function deletarMedico(req: Request, res: Response) {
  const medicoId = Number(req.params.id);
  const resultado = await medicoService.deletarMedico(medicoId);

  if (!resultado) {
    res.status(404).json({ message: "Médico não encontrado." });
    return;
  }

  res.status(200).json({
    message: "Médico removido com sucesso!",
  });
}
