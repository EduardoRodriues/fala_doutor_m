import { useCallback, useEffect, useState, type JSX } from "react";
import type { Consulta } from "../../types/consultas/consulta";
import Confirmacao from "../../components/confirmacao/confirmacao";
import FormularioConsultas from "../../components/form-consultas/form-consultas";
import "../global/css/index-gestao.css";
import {
  deletarConsultas,
  listarConsultas,
} from "../../services/consultas/apiConsultas";
import { FaBookMedical, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notificacoes from "../notifications/notifications";

function GestaoConsultas(): JSX.Element {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalNotificacoesAberto, setModalNotificacoesAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [consultaParaDeletar, setConsultaParaDeletar] =
    useState<Consulta | null>(null);
  const [consultaSelecionada, setConsultaSelecionada] =
    useState<Consulta | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);
  const [notificacoes, setNotificacoes] = useState(true);

  const fetchConsultas = useCallback(
    async (paginaAtual = 1, limitAtual = limit) => {
      const resposta = await listarConsultas(paginaAtual, limitAtual);
      setConsultas(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
      setNotificacoes(true);
    },
    [limit]
  );

  useEffect(() => {
    fetchConsultas(paginaAtual, limit);
  }, [paginaAtual, limit, fetchConsultas]);

  function abrirModalNovo() {
    setConsultaSelecionada(null);
    setModalAberto(true);
  }

  function abrirModalEditar(consulta: Consulta) {
    setConsultaSelecionada(consulta);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function abrirConfirmacao(consulta: Consulta) {
    setConsultaParaDeletar(consulta);
    setConfirmacaoAberta(true);
  }

  function fecharConfirmacao() {
    setConsultaParaDeletar(null);
    setConfirmacaoAberta(false);
  }

  async function confirmarDelecao() {
    if (consultaParaDeletar) {
      await deletarConsultas(consultaParaDeletar.id);
      fetchConsultas(paginaAtual, limit);
      fecharConfirmacao();
    }
  }

  function formatarData(data: string): string {
    const [ano, mes, dia] = data.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function handleLimiteChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLimit(Number(event.target.value));
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
        <h1>Gerenciamento de Consultas</h1>
        <button className="btn-novo" onClick={abrirModalNovo}>
          <FaBookMedical />
          Nova Consulta
        </button>
      </div>

      <section className="back">
        <div>
          <p>Lista de Consultas</p>
          <table className="tabela">
            <thead>
              <tr>
                <td>Médico</td>
                <td>Data</td>
                <td>Paciente</td>
                <td>Ações</td>
              </tr>
            </thead>
            <tbody>
              {consultas.map((consulta) => (
                <tr key={consulta.id}>
                  <td data-label="Medico">{consulta.medicoNome}</td>
                  <td data-label="Data">
                    {formatarData(consulta.dataConsulta)}
                  </td>
                  <td data-label="Paciente">{consulta.pacienteNome}</td>
                  <td>
                    <div className="acoes-container">
                      <button
                        className="btn-icon btn-icon-1"
                        aria-label="Editar"
                        onClick={() => abrirModalEditar(consulta)}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-icon btn-icon-2"
                        aria-label="Deletar"
                        onClick={() => abrirConfirmacao(consulta)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="paginacao">
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
            <label style={{ marginLeft: "1rem" }}>
              Itens por página:{" "}
              <select value={limit} onChange={handleLimiteChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
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
            <FormularioConsultas
              consulta={consultaSelecionada}
              onSuccess={() => {
                fecharModal();
                fetchConsultas(paginaAtual, limit);
              }}
            />
          </div>
        </div>
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

      {confirmacaoAberta && consultaParaDeletar && (
        <Confirmacao
          mensagem={`Tem certeza que deseja remover esta consulta?`}
          onConfirmar={confirmarDelecao}
          onCancelar={fecharConfirmacao}
        />
      )}
    </>
  );
}

export default GestaoConsultas;
