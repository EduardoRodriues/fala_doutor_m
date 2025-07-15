import { useCallback, useEffect, useState, type JSX } from "react";
import "../global/css/index-relatorios.css";
import type { Medico } from "../../../types/medicos/medico";
import { filtroMedicosIdade } from "../../../services/relatorios/medicos/filtroMedicoIdade";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { listarMedicos } from "../../../services/medicos/apiMedicos";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function RelatorioMedicos(): JSX.Element {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [todosMedicos, setTodosMedicos] = useState<Medico[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"lista" | "pizza" | "barra">(
    "lista"
  );

  const fetchMedicos = useCallback(
    async (page = 1, limitAtual = limit) => {
      const resposta = await filtroMedicosIdade(page, limitAtual);
      setMedicos(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
    },
    [limit]
  );

  const fetchTodosMedicos = useCallback(async () => {
    const resposta = await listarMedicos(1, 1000);
    setTodosMedicos(resposta.data);
  }, []);

  useEffect(() => {
    fetchMedicos(paginaAtual, limit);
    fetchTodosMedicos();
  }, [fetchMedicos, fetchTodosMedicos, paginaAtual, limit]);

  const handlePageChange = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
    fetchMedicos(novaPagina, limit);
  };

  const handleLimitChange = (novoLimite: number) => {
    setLimit(novoLimite);
    setPaginaAtual(1);
    fetchMedicos(1, novoLimite);
  };

  const totalMedicosAcima50 = medicos.length;
  const totalMedicos = todosMedicos.length;
  const totalMedicosAbaixoOuIgual50 = totalMedicos - totalMedicosAcima50;

  const dadosGrafico = {
    labels: ["Acima de 50", "Abaixo ou igual a 50"],
    datasets: [
      {
        label: "Médicos",
        data: [totalMedicosAcima50, totalMedicosAbaixoOuIgual50],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 20,
      },
    ],
  };

  function formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const renderLista = () => (
    <table className="tabela-relatorio">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>CRM</th>
        </tr>
      </thead>
      <tbody>
        {medicos.map((medico) => (
          <tr key={medico.id}>
            <td data-label="Nome">{medico.nome}</td>
            <td data-label="CPF">{formatarCPF(medico.cpf)}</td>
            <td data-label="CRM">{medico.crm}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPizza = () => (
    <div style={{ maxWidth: 600, margin: "1rem auto" }}>
      <Pie data={dadosGrafico} />
    </div>
  );

  const renderBarra = () => (
    <div style={{ maxWidth: 600, margin: "1rem auto" }}>
      <Bar data={dadosGrafico} options={{ indexAxis: "y" }} />
    </div>
  );

  return (
    <>
      <div className="header-relatorio">
        <h1>Relatório de Médicos</h1>
      </div>

      <section className="back-relatorio">
        <div>
          <div className="filtro-relatorio">
            <p>Médicos Acima de 50 anos</p>
            <label style={{ marginLeft: "1rem" }}>
              Visualizacão:
              <select
                value={viewMode}
                onChange={(e) =>
                  setViewMode(e.target.value as "lista" | "pizza" | "barra")
                }
              >
                <option value="lista">Lista</option>
                <option value="pizza">Gráfico de Pizza</option>
                <option value="barra">Gráfico de Barra</option>
              </select>
            </label>
          </div>

          {viewMode === "lista" && renderLista()}
          {viewMode === "pizza" && renderPizza()}
          {viewMode === "barra" && renderBarra()}

          {viewMode === "lista" && (
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
              <label className="itens-por-pagina">
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

export default RelatorioMedicos;
