import { useEffect, useState, type JSX } from "react";
import "./relatorio-plano.css";
import type { Plano } from "../../../types/plano";
import { filtroPrecoPlano } from "../../../services/relatorios/planos/filtroPrecoPlano";

function RelatorioPlanos(): JSX.Element {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [precoFiltro, setPrecoFiltro] = useState<number>(0);

  async function fetchPlanos(page = 1, limitAtual = limit, preco = precoFiltro) {
    const resposta = await filtroPrecoPlano(page, limitAtual, preco);
    setPlanos(resposta.data);
    setPaginaAtual(resposta.paginaAtual);
    setTotalPaginas(resposta.totalPaginas);
  }

  useEffect(() => {
    fetchPlanos(paginaAtual, limit, precoFiltro);
  }, );

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

  return (
    <>
      <div className="header">
        <h1>Relatório de Planos</h1>
      </div>

      <section className="back">
        <div>
          <div className="filtro-preco">
            <p>Lista de Planos</p>
            <label>
              Filtrar por preço:
              <select
                value={precoFiltro}
                onChange={(e) => handlePrecoChange(Number(e.target.value))}
              >
                <option value={0}>Todos</option>
                <option value={50}>Até 50</option>
                <option value={100}>Até 100</option>
                <option value={200}>Até 200</option>
                <option value={500}>Até 500</option>
                <option value={1000}>Até 1000</option>
              </select>
            </label>
          </div>

          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {planos.map((plano) => (
                <tr key={plano.id}>
                  <td data-label="Nome">{plano.nome}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
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

export default RelatorioPlanos;
