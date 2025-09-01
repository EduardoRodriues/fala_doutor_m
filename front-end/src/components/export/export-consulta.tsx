import { baixarExcelConsultas } from "../../services/relatorios/exports/export-consulta";
import "./global/index-export.css";

export function BotaoExportarConsultas() {
  return (
    <button onClick={baixarExcelConsultas} className="botao-exportar">
      Exportar Relatório
    </button>
  );
}
