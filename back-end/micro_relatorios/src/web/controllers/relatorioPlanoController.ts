import { Request, Response } from "express";
import { filtroPrecosPlanos } from "../services/relatorioPlanoService";

export async function filtroPreco(req: Request, res: Response) {
  const precoMinimo = parseFloat(req.query.preco as string) || 0;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await filtroPrecosPlanos(page, limit, precoMinimo);

  res.status(200).json(lista);
}
