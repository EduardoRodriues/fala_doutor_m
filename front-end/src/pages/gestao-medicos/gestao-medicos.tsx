import { useEffect, useState, type JSX } from "react";
import { listarMedicos } from "../../services/medicos/listarMedicos";
import { deletarMedico } from "../../services/medicos/deletarMedico";
import type { Medico } from "../../types/medico";
import FormularioMedico from "../../components/form-medicos/formulario-medico";
import Confirmacao from "../../components/confirmacao/confirmacao";
import "./gestao-medicos.css";

function GestaoMedicos(): JSX.Element {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [medicoSelecionado, setMedicoSelecionado] = useState<
    Medico | undefined
  >(undefined);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [medicoParaDeletar, setMedicoParaDeletar] = useState<Medico | null>(
    null
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);

  async function fetchMedicos(page = 1, limitAtual = limit) {
    const resposta = await listarMedicos(page, limitAtual);
    setMedicos(resposta.data);
    setPaginaAtual(resposta.paginaAtual);
    setTotalPaginas(resposta.totalPaginas);
  }

  useEffect(() => {
    fetchMedicos(paginaAtual, limit);
  });

  function abrirModalNovo() {
    setMedicoSelecionado(undefined);
    setModalAberto(true);
  }

  function abrirModalEditar(medico: Medico) {
    setMedicoSelecionado(medico);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function abrirConfirmacao(medico: Medico) {
    setMedicoParaDeletar(medico);
    setConfirmacaoAberta(true);
  }

  function fecharConfirmacao() {
    setMedicoParaDeletar(null);
    setConfirmacaoAberta(false);
  }

  async function confirmarDelecao() {
    if (medicoParaDeletar) {
      await deletarMedico(medicoParaDeletar.id);
      fetchMedicos(paginaAtual, limit);
      fecharConfirmacao();
    }
  }

  function formatarCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  function formatarData(data: string): string {
    const [ano, mes, dia] = data.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <>
      <div className="header">
        <h1>Gerenciamento de Médicos</h1>
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Novo Médico
        </button>
      </div>

      <section className="back">
        <div>
          <div>
            <p>Lista de Médicos</p>
          </div>
          <table className="tabela">
            <thead>
              <tr>
                <td>Nome</td>
                <td>CPF</td>
                <td>CRM</td>
                <td>Data Nasc.</td>
                <td>Planos</td>
                <td>Ações</td>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id}>
                  <td data-label="Nome">{medico.nome}</td>
                  <td data-label="CPF">{formatarCpf(medico.cpf)}</td>
                  <td data-label="CRM">{medico.crm}</td>
                  <td data-label="DataNasc">{formatarData(medico.dataNasc)}</td>
                  <td data-label="Planos">
                    {Array.isArray(medico.planos)
                      ? medico.planos.map((plano) => plano.nome).join(", ")
                      : ""}
                  </td>
                  <td>
                    <div className="acoes-container">
                      <button
                        className="btn-icon btn-icon-1"
                        aria-label="Editar"
                        onClick={() => abrirModalEditar(medico)}
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
                        onClick={() => abrirConfirmacao(medico)}
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
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPaginaAtual(1);
                }}
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

      {modalAberto && (
        <div
          className="modal-fundo"
          onClick={fecharModal}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <FormularioMedico
              medico={medicoSelecionado}
              onSuccess={() => {
                fecharModal();
                fetchMedicos(paginaAtual, limit);
              }}
            />
          </div>
        </div>
      )}

      {confirmacaoAberta && medicoParaDeletar && (
        <Confirmacao
          mensagem={`Tem certeza que deseja remover este médico: ${medicoParaDeletar.nome}?`}
          onConfirmar={confirmarDelecao}
          onCancelar={fecharConfirmacao}
        />
      )}
    </>
  );
}

export default GestaoMedicos;
