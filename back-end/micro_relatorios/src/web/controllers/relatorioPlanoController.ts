import { Request, Response } from "express";
import { filtroPrecosPlanos } from "../services/relatorioPlanoService";
import { gerarExcelBackend } from "../utils/export";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

export async function filtroPreco(req: Request, res: Response) {
  const precoMinimo = parseFloat(req.query.preco as string) || 0;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lista = await filtroPrecosPlanos(page, limit, precoMinimo);
  res.status(200).json(lista);
}

export async function baixarExcelPlanos(req: Request, res: Response) {
  const precoMinimo = parseFloat(req.query.preco as string) || 0;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lista = await filtroPrecosPlanos(page, limit, precoMinimo);

  const colunas = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nome", key: "nome", width: 30 },
    { header: "Preço", key: "preco", width: 15 },
    { header: "Descrição", key: "descricao", width: 30 },
  ];

  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, "Planos.xlsx");
  await gerarExcelBackend(lista.data, colunas, "Planos.xlsx");

  res.download(filePath, "Planos.xlsx", (err) => {
    if (err) res.status(500).send("Erro ao baixar o arquivo");
  });
}
