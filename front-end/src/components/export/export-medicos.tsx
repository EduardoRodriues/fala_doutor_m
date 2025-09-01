import { baixarExcelMedicos } from "../../services/relatorios/exports/export-medicos";

export function BotaoExportarMedicos() {
  return (
    <button onClick={baixarExcelMedicos} className="botao-exportar">
      Exportar Relatório
    </button>
  );
}
