import ExcelJS from "exceljs";
import { Coluna } from "../types/export/coluna";
import path from "path";

export async function gerarExcelBackend<T>(
  dados: T[],
  colunas: Coluna[],
  nomeArquivo: string
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Relatorio");

  worksheet.columns = colunas;

  dados.forEach((item: any) => {
    const linha = { ...item };
    if (linha.planos) {
      linha.planos = linha.planos.map((p: any) => p.nome).join(", ");
    }
    worksheet.addRow(linha);
  });

  const filePath = path.join(__dirname, "../temp", nomeArquivo);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
}
