import { Request, Response } from "express";
import * as consultaService from "../services/consultaService";
import { ConsultaDTO } from "../types/consultaDTO";

export async function listarConsultas(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await consultaService.buscarConsultasPaginado(page, limit);

  res.status(200).json(lista);
}

export async function buscarConsultaPorId(req: Request, res: Response) {
  const id = Number(req.params.id);

  const consulta = await consultaService.buscarConsultaPorId(id);

  if (!consulta) {
    return res.status(404).json({ message: "Consulta não encontrada" });
  }

  res.status(200).json(consulta);
}

export async function cadastrarConsulta(req: Request, res: Response) {
  const data = req.body as ConsultaDTO;

  const novaConsulta = await consultaService.cadastrarConsulta(data);

  res.status(201).json(novaConsulta);
}

export async function editarConsulta(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = req.body as ConsultaDTO;

  const consultaAtualizada = await consultaService.editarConsulta(id, data);

  if (!consultaAtualizada) {
    return res
      .status(404)
      .json({ message: "Consulta não encontrada para atualização" });
  }

  res.status(200).json(consultaAtualizada);
}

export async function deletarConsulta(req: Request, res: Response) {
  const id = Number(req.params.id);

  await consultaService.deletarConsulta(id);

  res.status(201).json({ message: "Consulta removida com sucesso!" });
}
