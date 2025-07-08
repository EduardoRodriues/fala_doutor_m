import { useCallback, useEffect, useState, type JSX } from "react";
import "./relatorio-plano.css";
import type { Plano } from "../../../types/plano";
import { filtroPrecoPlano } from "../../../services/relatorios/planos/filtroPrecoPlano";
import { listarPlanos } from "../../../services/planos/listarPlanos";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement
);

function RelatorioPlanos(): JSX.Element {
  const [planosFiltrados, setPlanosFiltrados] = useState<Plano[]>([]);
  const [planosTodos, setPlanosTodos] = useState<Plano[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [precoFiltro, setPrecoFiltro] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"lista" | "pizza" | "barra">(
    "lista"
  );

  const fetchPlanosFiltrados = useCallback(
    async (page = 1, limitAtual = limit, preco = precoFiltro) => {
      const resposta = await filtroPrecoPlano(page, limitAtual, preco);
      setPlanosFiltrados(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
    },
    [limit, precoFiltro]
  );

  async function fetchPlanosTodos(page = 1, limitAtual = 1000) {
    const resposta = await listarPlanos(page, limitAtual);
    setPlanosTodos(resposta.data);
  }

  useEffect(() => {
    fetchPlanosFiltrados(paginaAtual, limit, precoFiltro);
  }, [paginaAtual, limit, precoFiltro, fetchPlanosFiltrados]);

  useEffect(() => {
    fetchPlanosTodos();
  }, []);

  const handlePageChange = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
  };

  const handleLimitChange = (novoLimite: number) => {
    setLimit(novoLimite);
    setPaginaAtual(1);
  };

  const handlePrecoChange = (novoPreco: number) => {
    setPrecoFiltro(novoPreco);
    setPaginaAtual(1);
  };

  const quantidadeMaisDe = planosFiltrados.length;
  const quantidadeTotal = planosTodos.length;
  const quantidadeRestante = quantidadeTotal - quantidadeMaisDe;

  const dadosGrafico =
    precoFiltro === 0
      ? [{ nome: "Todos os Planos", quantidade: quantidadeTotal }]
      : [
          { nome: `Mais de R$ ${precoFiltro}`, quantidade: quantidadeMaisDe },
          { nome: `Até R$ ${precoFiltro}`, quantidade: quantidadeRestante },
        ];

  const graficoPizzaData = {
    labels: dadosGrafico.map((d) => d.nome),
    datasets: [
      {
        label: "Planos",
        data: dadosGrafico.map((d) => d.quantidade),
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 20,
      },
    ],
  };

  const graficoBarraData = {
    labels: dadosGrafico.map((d) => d.nome),
    datasets: [
      {
        label: "Número de Planos",
        data: dadosGrafico.map((d) => d.quantidade),
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const renderLista = () => (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>
        {planosFiltrados.map((plano) => (
          <tr key={plano.id}>
            <td data-label="Nome">{plano.nome}</td>
            <td data-label="Preço">R$ {plano.preco}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPizza = () => (
    <div
      style={{
        maxWidth: 600,
        margin: "1rem auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Pie data={graficoPizzaData} />
    </div>
  );

  const renderBarra = () => (
    <div
      style={{
        maxWidth: 600,
        margin: "1rem auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Bar data={graficoBarraData} options={{ indexAxis: "y" }} />
    </div>
  );

  return (
    <>
      <div className="header-relatorio-planos">
        <h1>Relatório de Planos</h1>
      </div>

      <section className="back-relatorio-planos">
        <div>
          <div className="view-selector-relatorio-planos">
            <p>Planos</p>
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
          </div>

          <div className="filtro-preco-relatorio-planos">
            <label>
              Filtrar por preço (mais de):
              <select
                value={precoFiltro}
                onChange={(e) => handlePrecoChange(Number(e.target.value))}
              >
                <option value={0}>Todos</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
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

export default RelatorioPlanos;
