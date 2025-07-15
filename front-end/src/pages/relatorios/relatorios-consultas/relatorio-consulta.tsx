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
import { gerarRelatorioConsulta } from "../../../services/relatorios/consultas/relatorioConsulta";
import type { ConsultaPorMedico } from "../../../types/relatorios/consultaPorMedico";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function RelatorioConsultas(): JSX.Element {
  const [consultas, setConsultas] = useState<ConsultaPorMedico[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [tipoVisualizacao, setTipoVisualizacao] = useState<string>("lista");

  const fetchConsultas = useCallback(
    async (page = 1, limitAtual = limit) => {
      const resposta = await gerarRelatorioConsulta(page, limitAtual);
      setConsultas(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
    },
    [limit]
  );

  useEffect(() => {
    fetchConsultas(paginaAtual, limit);
  }, [paginaAtual, limit, fetchConsultas]);

  const handlePageChange = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
  };

  const handleLimitChange = (novoLimite: number) => {
    setLimit(novoLimite);
    setPaginaAtual(1);
  };

  const handleTipoVisualizacaoChange = (novoTipoVis: string) => {
    setTipoVisualizacao(novoTipoVis);
  };

  const dadosGraficoConsultasMedico = (() => {
    if (!consultas || consultas.length === 0) return null;

    const labels = consultas.map((item) => item.medicoNome);
    const counts = consultas.map((item) => item.pacientesNome.length);

    return {
      labels,
      datasets: [
        {
          label: "Número de Consultas",
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
        <h1>Relatório de Consultas</h1>
      </div>

      <section className="back-relatorio">
        <div>
          <div className="filtro-relatorio">
            <p>Consultas por Médico</p>

            <label style={{ marginLeft: "1rem" }}>
              Visualização:
              <select
                value={tipoVisualizacao}
                onChange={(e) => handleTipoVisualizacaoChange(e.target.value)}
              >
                <option value="lista">Lista</option>
                <option value="pizza">Gráfico de Pizza</option>
                <option value="barra">Gráfico de Barra</option>
              </select>
            </label>
          </div>

          {tipoVisualizacao !== "lista" && (
            <div
              style={{ maxWidth: 600, margin: "1rem auto" }}
              className="grafico-relatorio"
            >
              {dadosGraficoConsultasMedico &&
                (tipoVisualizacao === "pizza" ? (
                  <Pie data={dadosGraficoConsultasMedico} />
                ) : (
                  <Bar
                    data={dadosGraficoConsultasMedico}
                    options={{ indexAxis: "y" }}
                  />
                ))}
            </div>
          )}

          {tipoVisualizacao === "lista" && (
            <table className="tabela-relatorio">
              <thead>
                <tr>
                  {consultas.map((medico) => (
                    <th key={medico.medicoNome}>{medico.medicoNome}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  if (!consultas || consultas.length === 0) return null;

                  const maxPacientes = Math.max(
                    ...consultas.map((medico) => medico.pacientesNome.length)
                  );

                  const linhas = [];
                  for (let i = 0; i < maxPacientes; i++) {
                    linhas.push(
                      <tr key={i}>
                        {consultas.map((medico) => (
                          <td
                            key={medico.medicoNome}
                            data-label={medico.medicoNome}
                          >
                            {medico.pacientesNome[i] ?? ""}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  return linhas;
                })()}
              </tbody>
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

export default RelatorioConsultas;
