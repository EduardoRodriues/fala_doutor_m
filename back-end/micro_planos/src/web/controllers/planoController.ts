import * as planoService from "../services/planoService";
import { Request, Response } from "express";

export async function listarPlanos(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await planoService.buscarPlanosPaginado(page, limit);
  res.status(200).json(lista);
}

export async function cadastrarPlano(req: Request, res: Response) {
  const planoNovo = await planoService.cadastrarPlano(req.body);
  res.status(201).json({
    plano: planoNovo,
    message: "Plano cadastrado com sucesso!",
  });
}

export async function buscarPlanoPorId(req: Request, res: Response) {
  const id = await Number(req.params.id);
  const planoId = await planoService.buscarPorId(id);

  res.status(200).json(planoId);
}

export async function atualizarPlano(req: Request, res: Response) {
  const planoId = Number(req.params.id);
  const planoData = req.body;

  const planoNovo = await planoService.editarPlano(planoId, planoData);

  if (!planoNovo) {
    res.status(404).json({ message: "Plano não encontrado." });
    return;
  }

  res.status(200).json({
    message: "Plano editado com sucesso!",
    plano: planoNovo,
  });
}

export async function deletarPlano(req: Request, res: Response) {
  const planoId = Number(req.params.id);
  await planoService.deletarPlano(planoId);

  res.status(200).json({
    message: "Plano removido com sucesso!",
  });
}
