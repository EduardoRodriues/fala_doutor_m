import { useEffect, useState, type JSX } from "react";
import "./relatorio-medico.css";
import type { Medico } from "../../../types/medico";
import { filtroMedicosIdade } from "../../../services/relatorios/medicos/filtroMedicoIdade";

function RelatorioMedicos(): JSX.Element {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);

  async function fetchMedicos(page = 1, limitAtual = limit) {
    const resposta = await filtroMedicosIdade(page, limitAtual);
    setMedicos(resposta.data);
    setPaginaAtual(resposta.paginaAtual);
    setTotalPaginas(resposta.totalPaginas);
  }

  useEffect(() => {
    fetchMedicos(paginaAtual, limit);
  }, );

  const handlePageChange = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
  };

  const handleLimitChange = (novoLimite: number) => {
    setLimit(novoLimite);
    setPaginaAtual(1);
  };

  return (
    <>
      <div className="header">
        <h1>Relatório de Médicos</h1>
      </div>

      <section className="back">
        <div>
          <div>
            <p>Lista de Médicos Acima de 50 anos</p>
          </div>
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id}>
                  <td data-label="Nome">{medico.nome}</td>
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
            <label style={{ marginLeft: "1rem" }}>
              Itens por página:{" "}
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

export default RelatorioMedicos;
