import { Request, Response } from "express";
import {
  filtroPacientesAcimaDe50,
  pacientesPorPlano,
} from "../services/relatorioPacienteService";
import { gerarExcelBackend } from "../utils/export";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

export async function pacienteAcima50(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lista = await filtroPacientesAcimaDe50(page, limit);
  res.status(200).json(lista);
}

export async function baixarExcelPacientesAcima50(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lista = await filtroPacientesAcimaDe50(page, limit);

  const colunas = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nome", key: "nome", width: 30 },
    { header: "CPF", key: "cpf", width: 20 },
    { header: "Data Nascimento", key: "dataNasc", width: 20 },
  ];

  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, "PacientesAcima50.xlsx");
  await gerarExcelBackend(lista.data, colunas, "PacientesAcima50.xlsx");

  res.download(filePath, "PacientesAcima50.xlsx", (err) => {
    if (err) res.status(500).send("Erro ao baixar o arquivo");
  });
}

export async function relatorioPacientesPorPlano(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const resultado = await pacientesPorPlano(page, limit);
  res.status(200).json(resultado);
}

export async function baixarExcelPacientesPorPlano(
  req: Request,
  res: Response
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const resultado = await pacientesPorPlano(page, limit);

  const dadosParaExcel = resultado.data.map((item) => ({
    plano: item.planoNome,
    quantidade: item.pacientes.length,
  }));

  const colunas = [
    { header: "Plano", key: "plano", width: 30 },
    { header: "Quantidade de Pacientes", key: "quantidade", width: 20 },
  ];

  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, "PacientesPorPlano.xlsx");
  await gerarExcelBackend(dadosParaExcel, colunas, "PacientesPorPlano.xlsx");

  res.download(filePath, "PacientesPorPlano.xlsx", (err) => {
    if (err) res.status(500).send("Erro ao baixar o arquivo");
  });
}
