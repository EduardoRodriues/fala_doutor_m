import { useState } from "react";
import {
  baixarExcelPacientes50,
  baixarExcelPacientesPlano,
} from "../../services/relatorios/exports/export-paciente";
import "./global/index-export.css";

export function BotaoExportarPacientes() {
  const [aberto, setAberto] = useState(false);

  const handleClick = (tipo: "idade" | "plano") => {
    if (tipo === "idade") baixarExcelPacientes50();
    else baixarExcelPacientesPlano();
    setAberto(false);
  };

  return (
    <div className="dropdown-botao">
      <button
        className="botao-principal"
        onClick={() => setAberto(!aberto)}
      >
        Exportar Relatório
      </button>
      {aberto && (
        <ul className="dropdown-menu">
          <li onClick={() => handleClick("idade")}>Pacientes Acima de 50</li>
          <li onClick={() => handleClick("plano")}>Pacientes por Plano</li>
        </ul>
      )}
    </div>
  );
}
