import { useEffect, useState, type JSX } from "react";
import "./relatorio-paciente.css";
import type { Paciente } from "../../../types/paciente";
import { filtrolPacienteIdade } from "../../../services/relatorios/pacientes/filtroPacienteIdade";
import { filtroPacientePorPlano } from "../../../services/relatorios/pacientes/filtroPacientesPorPlano";

type PacientesPorPlano = {
  planoId: string;
  pacientes: Array<{
    id: string;
    nome: string;
    cpf: string;
    dataNasc: string;
    planoId: string;
  }>;
};

function RelatorioPacientes(): JSX.Element {
  const [pacientes, setPacientes] = useState<Paciente[] | PacientesPorPlano[]>(
    []
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("idade");

  async function fetchPacientes(
    page = 1,
    limitAtual = limit,
    tipo = tipoRelatorio
  ) {
    let resposta;
    if (tipo === "idade") {
      resposta = await filtrolPacienteIdade(page, limitAtual);
      setPacientes(resposta.data);
    } else {
      resposta = await filtroPacientePorPlano(page, limitAtual);
      setPacientes(resposta.data);
    }
    setPaginaAtual(resposta.paginaAtual);
    setTotalPaginas(resposta.totalPaginas);
  }

  useEffect(() => {
    fetchPacientes(paginaAtual, limit, tipoRelatorio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual, limit, tipoRelatorio]);

  const handlePageChange = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
  };

  const handleLimitChange = (novoLimite: number) => {
    setLimit(novoLimite);
    setPaginaAtual(1);
  };

  const handleTipoRelatorioChange = (novoTipo: string) => {
    setTipoRelatorio(novoTipo);
    setPaginaAtual(1);
  };

  return (
    <>
      <div className="header">
        <h1>Relatório de Pacientes</h1>
      </div>

      <section className="back">
        <div>
          <div className="filtro-pacientes">
            <p>Lista de Pacientes</p>
            <label>
              Tipo de Relatório:
              <select
                value={tipoRelatorio}
                onChange={(e) => handleTipoRelatorioChange(e.target.value)}
              >
                <option value="idade">Pacientes Acima de 50</option>
                <option value="plano">Pacientes por Plano</option>
              </select>
            </label>
          </div>

          <table className="tabela">
            {tipoRelatorio === "idade" ? (
              <>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(pacientes as Paciente[]).map((paciente) => (
                    <tr key={paciente.id}>
                      <td data-label="Nome">{paciente.nome}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr>
                    <th>Plano ID</th>
                    <th>Pacientes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(pacientes as PacientesPorPlano[]).map((plano) => (
                    <tr key={plano.planoId}>
                      <td data-label="Plano ID">{plano.planoId}</td>
                      <td data-label="Pacientes">
                        {Array.isArray(plano.pacientes)
                          ? plano.pacientes.map((p) => p.nome).join(", ")
                          : "Nenhum paciente"}
                      </td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          <div className="paginacao">
            <button
              disabled={paginaAtual === 1}
              onClick={() => handlePageChange(paginaAtual - 1)}
            >
              Anterior
            </button>
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => handlePageChange(paginaAtual + 1)}
            >
              Próxima
            </button>
            <label>
              Itens por página:
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
        </div>
      </section>
    </>
  );
}

export default RelatorioPacientes;
