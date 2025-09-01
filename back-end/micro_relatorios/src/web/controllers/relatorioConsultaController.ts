import { Request, Response } from "express";
import * as relatorioConsultaService from "../services/relatorioConsultaService";
import { gerarExcelBackend } from "../utils/export";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

export async function relatorioConsultas(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const relatorio = await relatorioConsultaService.gerarRelatorioConsultas(
    page,
    limit
  );
  res.status(200).json(relatorio);
}

export async function baixarExcelConsultas(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const relatorio = await relatorioConsultaService.gerarRelatorioConsultas(
    page,
    limit
  );

  const dadosParaExcel = relatorio.data.map((item, index) => ({
    id: index + 1,
    medico: item.medicoNome,
    pacientes: item.pacientesNome.join(", "),
  }));

  const colunas = [
    { header: "ID", key: "id", width: 10 },
    { header: "Médico", key: "medico", width: 30 },
    { header: "Pacientes", key: "pacientes", width: 50 },
  ];

  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, "RelatorioConsultas.xlsx");
  await gerarExcelBackend(dadosParaExcel, colunas, "RelatorioConsultas.xlsx");

  res.download(filePath, "RelatorioConsultas.xlsx", (err) => {
    if (err) res.status(500).send("Erro ao baixar o arquivo");
  });
}
