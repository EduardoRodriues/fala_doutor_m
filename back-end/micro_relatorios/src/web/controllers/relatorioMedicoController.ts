import { Request, Response } from "express";
import { filtroMedicosAcima50Anos } from "../services/relatorioMedicoService";
import { gerarExcelBackend } from "../utils/export";
import path from "path";
import fs from "fs";

export async function medicosAcima50(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await filtroMedicosAcima50Anos(page, limit);

  res.status(200).json(lista);
}

export async function baixarExcelMedicos(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const lista = await filtroMedicosAcima50Anos(page, limit);

  const colunas = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nome", key: "nome", width: 30 },
    { header: "CPF", key: "cpf", width: 20 },
    { header: "CRM", key: "crm", width: 20 },
    { header: "Data Nascimento", key: "dataNasc", width: 20 },
    { header: "Planos", key: "planos", width: 30 },
  ];

  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, "RelatorioMedicos.xlsx");
  await gerarExcelBackend(lista.data, colunas, "RelatorioMedicos.xlsx");

  res.download(filePath, "RelatorioMedicos.xlsx", (err) => {
    if (err) {
      console.error("Erro ao baixar o arquivo:", err);
      res.status(500).send("Erro ao baixar o arquivo");
    }
  });
}
