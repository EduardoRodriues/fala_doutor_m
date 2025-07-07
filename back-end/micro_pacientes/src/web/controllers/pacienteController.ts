import * as pacienteService from "../services/pacienteService";
import { Request, Response } from "express";

export async function listarTodos(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await pacienteService.buscarPacientesPaginado(page, limit);
  res.status(200).json(lista);
}

export async function cadastrarPaciente(req: Request, res: Response) {
  const pacienteNovo = await pacienteService.criarPaciente(req.body);
  res.status(201).json({
    paciente: pacienteNovo,
    message: "Paciente cadastrado com sucesso!",
  });
}

export async function buscarPacientePorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  const pacienteId = await pacienteService.buscarPorId(id);

  if (!pacienteId) {
    res.status(404).json({ message: "Paciente não encontrado." });
    return;
  }

  res.status(200).json(pacienteId);
}

export async function atualizarPaciente(req: Request, res: Response) {
  const pacienteId = Number(req.params.id);
  const pacienteData = req.body;

  const pacienteNovo = await pacienteService.editarPaciente(
    pacienteId,
    pacienteData
  );

  if (!pacienteNovo) {
    res.status(404).json({ message: "Paciente não encontrado." });
    return;
  }

  res.status(200).json({
    message: "Paciente editado com sucesso!",
    paciente: pacienteNovo,
  });
}

export async function deletarpaciente(req: Request, res: Response) {
  const pacienteId = Number(req.params.id);
  await pacienteService.deletarPaciente(pacienteId);

  res.status(200).json({
    message: "Paciente removido com sucesso!",
  });
}
