import { useEffect, useState, type JSX } from "react";
import "./gestao-planos.css";
import type { Plano } from "../../types/plano";
import { listarPlanos } from "../../services/planos/listarPlanos";
import { deletarPlanos } from "../../services/planos/deletarPlano";
import FormularioPlano from "../../components/form-planos/formulario-plano";
import ConfirmacaoDialog from "../../components/confirmacao/confirmacao";

function GestaoPlanos(): JSX.Element {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | undefined>(
    undefined
  );
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [planoParaDeletar, setPlanoParaDeletar] = useState<Plano | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limite, setLimite] = useState(10);

  async function fetchPlanos(page = paginaAtual, limitAtual = limite) {
    const resposta = await listarPlanos(page, limitAtual);
    setPlanos(resposta.data);
    setPaginaAtual(resposta.paginaAtual);
    setTotalPaginas(resposta.totalPaginas);
  }

  useEffect(() => {
    fetchPlanos();
  });

  function abrirModalNovo() {
    setPlanoSelecionado(undefined);
    setModalAberto(true);
  }

  function abrirModalEditar(plano: Plano) {
    setPlanoSelecionado(plano);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function abrirConfirmacao(plano: Plano) {
    setPlanoParaDeletar(plano);
    setConfirmacaoAberta(true);
  }

  function fecharConfirmacao() {
    setPlanoParaDeletar(null);
    setConfirmacaoAberta(false);
  }

  async function confirmarDelecao() {
    if (planoParaDeletar) {
      await deletarPlanos(planoParaDeletar.id);
      fetchPlanos();
      fecharConfirmacao();
    }
  }

  function formatarPreco(valor: string | number): string {
    const numero = typeof valor === "string" ? parseFloat(valor) : valor;
    if (isNaN(numero)) return "-";
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleLimiteChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLimite(parseInt(event.target.value));
    setPaginaAtual(1);
  }

  return (
    <>
      <div className="header">
        <h1>Gerenciamento de Planos</h1>
        <button className="btn-novo" onClick={abrirModalNovo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <line x1="12" y1="17" x2="12" y2="17" />
          </svg>
          Novo Plano
        </button>
      </div>

      <section className="back">
        <div>
          <div>
            <p>Lista de Planos</p>
          </div>
          <table className="tabela">
            <thead>
              <tr>
                <td>Nome</td>
                <td>Descrição</td>
                <td>Preço</td>
                <td>Ações</td>
              </tr>
            </thead>
            <tbody>
              {planos.map((plano) => (
                <tr key={plano.id}>
                  <td data-label="Nome">{plano.nome}</td>
                  <td data-label="Descrição">{plano.descricao}</td>
                  <td data-label="Preço">{formatarPreco(plano.preco)}</td>
                  <td>
                    <button
                      className="btn-icon btn-icon-1"
                      aria-label="Editar"
                      onClick={() => abrirModalEditar(plano)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon btn-icon-2"
                      aria-label="Deletar"
                      onClick={() => abrirConfirmacao(plano)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="paginacao-container">
            <div className="botoes-paginacao">
              <button
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(paginaAtual - 1)}
              >
                Anterior
              </button>
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(paginaAtual + 1)}
              >
                Próxima
              </button>
            </div>

            <div className="controle-limite">
              <label htmlFor="limite">Itens por página:</label>
              <select id="limite" value={limite} onChange={handleLimiteChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {modalAberto && (
        <div
          className="modal-fundo"
          onClick={fecharModal}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <FormularioPlano
              plano={planoSelecionado}
              onSuccess={() => {
                fecharModal();
                fetchPlanos();
              }}
            />
          </div>
        </div>
      )}

      {confirmacaoAberta && planoParaDeletar && (
        <ConfirmacaoDialog
          mensagem={`Tem certeza que deseja remover este plano: ${planoParaDeletar.nome}?`}
          onConfirmar={confirmarDelecao}
          onCancelar={fecharConfirmacao}
        />
      )}
    </>
  );
}

export default GestaoPlanos;
