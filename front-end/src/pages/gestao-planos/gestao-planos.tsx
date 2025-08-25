import { useCallback, useEffect, useState, type JSX } from "react";
import FormularioPlano from "../../components/form-planos/formulario-plano";
import ConfirmacaoDialog from "../../components/confirmacao/confirmacao";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notificacoes from "../notifications/notifications";
import "../global/css/index-gestao.css";
import { deletarPlanos, listarPlanos } from "../../services/planos/apiPlanos";
import { FaFileMedical, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import type { Plano } from "../../types/planos/plano";

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
  const [modalNotificacoesAberto, setModalNotificacoesAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);

  const fetchPlanos = useCallback(
    async (page = 1, limiteAtual = limite) => {
      const resposta = await listarPlanos(page, limiteAtual);
      setPlanos(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
      setNotificacoes(true);
    },
    [limite]
  );

  useEffect(() => {
    fetchPlanos(paginaAtual, limite);
  }, [paginaAtual, limite, fetchPlanos]);

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

  function abrirNotificacoes() {
    setModalNotificacoesAberto(true);
    setNotificacoes(false);
  }

  function fecharNotificacoes() {
    setModalNotificacoesAberto(false);
  }

  return (
    <>
      <NotificationsIcon
        style={{
          fontSize: 35,
          color: "#5b5757",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={abrirNotificacoes}
        className="notiIcon"
      />
      {notificacoes && (
        <span
          style={{
            position: "fixed",
            top: "1.6rem",
            right: "1.3rem",
            width: "12px",
            height: "12px",
            backgroundColor: "red",
            borderRadius: "50%",
            border: "2px solid white",
            zIndex: 1001,
          }}
        />
      )}
      <div className="header">
        <h1>Gerenciamento de Planos</h1>
        <button className="btn-novo" onClick={abrirModalNovo}>
          <FaFileMedical />
          Novo Plano
        </button>
      </div>
      <section className="back">
        <div>
          <p>Lista de Planos</p>
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
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-icon btn-icon-2"
                      aria-label="Deletar"
                      onClick={() => abrirConfirmacao(plano)}
                    >
                      <FaRegTrashAlt />
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
      {modalNotificacoesAberto && (
        <div
          className="modal-fundo-noti"
          onClick={fecharNotificacoes}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <Notificacoes />
          </div>
        </div>
      )}
    </>
  );
}

export default GestaoPlanos;
