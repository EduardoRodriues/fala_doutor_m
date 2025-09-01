import { baixarExcelPlanos } from "../../services/relatorios/exports/export-planos";

export function BotaoExportarPlanos() {
  return (
    <button onClick={baixarExcelPlanos} className="botao-exportar">
      Exportar Relatório
    </button>
  );
}
