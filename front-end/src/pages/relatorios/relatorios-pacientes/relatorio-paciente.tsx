import { useEffect, useState, useCallback, type JSX } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "../global/css/index-relatorios.css";
import type { Paciente } from "../../../types/pacientes/paciente";
import type { PacientesPorPlano } from "../../../types/relatorios/pacientesPorPlano";
import {
  filtrolPacienteIdade,
  filtroPacientePorPlano,
} from "../../../services/relatorios/pacientes/filtrosPaciente";
import { listarPacientes } from "../../../services/pacientes/apiPacientes";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function RelatorioPacientes(): JSX.Element {
  const [pacientes, setPacientes] = useState<Paciente[] | PacientesPorPlano[]>(
    []
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("idade");
  const [tipoVisualizacao, setTipoVisualizacao] = useState<string>("lista");
  const [todosPacientes, setTodosPacientes] = useState<Paciente[]>([]);

  const fetchPacientes = useCallback(
    async (page = 1, limitAtual = limit, tipo = tipoRelatorio) => {
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
    },
    [limit, tipoRelatorio]
  );

  async function fetchTodosPacientes() {
    const resposta = await listarPacientes(1, 1000);
    setTodosPacientes(resposta.data);
  }

  useEffect(() => {
    fetchPacientes(paginaAtual, limit, tipoRelatorio);
  }, [paginaAtual, limit, tipoRelatorio, fetchPacientes]);

  useEffect(() => {
    if (tipoRelatorio === "idade") {
      fetchTodosPacientes();
    }
  }, [tipoRelatorio]);

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
    setTipoVisualizacao("lista");
  };

  const handleTipoVisualizacaoChange = (novoTipoVis: string) => {
    setTipoVisualizacao(novoTipoVis);
  };

  function formatarData(data: string): string {
    const [ano, mes, dia] = data.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  const dadosGraficoIdade = (() => {
    if (!todosPacientes || todosPacientes.length === 0) return null;

    const acima50 = (pacientes as Paciente[]).length;
    const abaixo50 = todosPacientes.length - acima50;

    return {
      labels: ["Acima de 50", "Abaixo de 50"],
      datasets: [
        {
          label: "Pacientes",
          data: [acima50, abaixo50],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverOffset: 20,
        },
      ],
    };
  })();

  const dadosGraficoPacientesPlano = (() => {
    const planosArray = pacientes as PacientesPorPlano[];
    if (!planosArray || planosArray.length === 0) return null;

    const labels = planosArray.map((plano) => plano.planoNome);
    const counts = planosArray.map((plano) =>
      plano && plano.pacientes ? plano.pacientes.length : 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Número de Pacientes",
          data: counts,
          backgroundColor: labels.map(
            (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 50%)`
          ),
        },
      ],
    };
  })();

  return (
    <>
      <div className="header-relatorio">
        <h1>Relatório de Pacientes</h1>
      </div>

      <section className="back-relatorio">
        <div>
          <div className="filtro-relatorio">
            <p>Pacientes</p>

            <div>
              <label style={{ marginLeft: "1rem" }}>
                Visualização:
                <select
                  className="select-lista"
                  value={tipoVisualizacao}
                  onChange={(e) => handleTipoVisualizacaoChange(e.target.value)}
                >
                  <option value="lista">Lista</option>
                  <option value="pizza">Gráfico de Pizza</option>
                  <option value="barra">Gráfico de Barra</option>
                </select>
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
          </div>

          {tipoVisualizacao !== "lista" && (
            <div
              style={{ maxWidth: 600, margin: "1rem auto" }}
              className="grafico-relatorio"
            >
              {tipoRelatorio === "idade" &&
                dadosGraficoIdade &&
                (tipoVisualizacao === "pizza" ? (
                  <Pie data={dadosGraficoIdade} />
                ) : (
                  <Bar data={dadosGraficoIdade} options={{ indexAxis: "y" }} />
                ))}

              {tipoRelatorio === "plano" &&
                dadosGraficoPacientesPlano &&
                (tipoVisualizacao === "pizza" ? (
                  <Pie data={dadosGraficoPacientesPlano} />
                ) : (
                  <Bar
                    data={dadosGraficoPacientesPlano}
                    options={{ indexAxis: "y" }}
                  />
                ))}
            </div>
          )}

          {tipoVisualizacao === "lista" && (
            <table className="tabela-relatorio">
              {tipoRelatorio === "idade" ? (
                <>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Data de Nacsimento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pacientes as Paciente[]).map((paciente) => (
                      <tr key={paciente.id}>
                        <td data-label="Nome">{paciente.nome}</td>
                        <td data-label="Nome">{formatarCpf(paciente.cpf)}</td>
                        <td data-label="Nome">
                          {formatarData(paciente.dataNasc)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <>
                  <thead>
                    <tr>
                      {(pacientes as PacientesPorPlano[])
                        .map((plano) => plano.planoNome)
                        .map((planoId) => (
                          <th key={planoId}>{planoId}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const planosArray = pacientes as PacientesPorPlano[];
                      if (!planosArray || planosArray.length === 0) return null;

                      const maxPacientes = Math.max(
                        ...planosArray.map((plano) =>
                          plano && plano.pacientes ? plano.pacientes.length : 0
                        )
                      );

                      const linhas = [];
                      for (let i = 0; i < maxPacientes; i++) {
                        linhas.push(
                          <tr key={i}>
                            {planosArray.map((plano) => (
                              <td
                                key={plano.planoNome}
                                data-label={plano.planoNome}
                              >
                                {plano?.pacientes?.[i]?.nome ?? ""}
                              </td>
                            ))}
                          </tr>
                        );
                      }
                      return linhas;
                    })()}
                  </tbody>
                </>
              )}
            </table>
          )}

          {tipoVisualizacao !== "lista" && (
            <div className="paginacao" style={{ display: "none" }}></div>
          )}

          {tipoVisualizacao === "lista" && (
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
          )}
        </div>
      </section>
    </>
  );
}

export default RelatorioPacientes;
