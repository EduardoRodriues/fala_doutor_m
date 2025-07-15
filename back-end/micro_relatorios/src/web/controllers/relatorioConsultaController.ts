import { Request, Response } from "express";
import * as relatorioConsultaService from "../services/relatorioConsultaService";

export async function relatorioConsultas(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const relatorio = await relatorioConsultaService.gerarRelatorioConsultas(page, limit);
  res.status(200).json(relatorio);
}
