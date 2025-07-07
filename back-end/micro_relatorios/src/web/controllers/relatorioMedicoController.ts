import { Request, Response } from "express";
import { filtroMedicosAcima50Anos } from "../services/relatorioMedicoService";

export async function medicosAcima50(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await filtroMedicosAcima50Anos(page, limit);

  res.status(200).json(lista);
}
