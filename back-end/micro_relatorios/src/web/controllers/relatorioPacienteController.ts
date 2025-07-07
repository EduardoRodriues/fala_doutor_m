import { Request, Response } from "express";
import {
  filtroPacientesAcimaDe50,
  pacientesPorPlano,
} from "../services/relatorioPacienteService";

export async function pacienteAcima50(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await filtroPacientesAcimaDe50(page, limit);

  res.status(200).json(lista);
}

export async function relatorioPacientesPorPlano(req: Request, res: Response) {
     const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const resultado = await pacientesPorPlano(page, limit);
  res.status(200).json(resultado);
}
