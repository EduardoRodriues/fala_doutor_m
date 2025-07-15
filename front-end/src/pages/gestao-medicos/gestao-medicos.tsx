import { useCallback, useEffect, useState, type JSX } from "react";
import type { Medico } from "../../types/medicos/medico";
import Confirmacao from "../../components/confirmacao/confirmacao";
import "../global/css/index-gestao.css";
import FormularioMedico from "../../components/form-medicos/formulario-medico";
import {
  deletarMedico,
  listarMedicos,
} from "../../services/medicos/apiMedicos";
import { FaRegEdit, FaRegTrashAlt, FaUserPlus } from "react-icons/fa";

function GestaoMedicos(): JSX.Element {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [medicoParaDeletar, setMedicoParaDeletar] = useState<Medico | null>(
    null
  );
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(
    null
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchMedicos = useCallback(
    async (paginaAtual = 1, limitAtual = limit) => {
      const resposta = await listarMedicos(paginaAtual, limitAtual);
      setMedicos(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
    },
    [limit]
  );

  useEffect(() => {
    fetchMedicos(paginaAtual, limit);
  }, [paginaAtual, limit, fetchMedicos]);

  function abrirModalNovo() {
    setMedicoSelecionado(null);
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

  function formatarData(data: string): string {
    const [ano, mes, dia] = data.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  return (
    <>
      <div className="header">
        <h1>Gerenciamento de Médicos</h1>
        <button className="btn-novo" onClick={abrirModalNovo}>
          <FaUserPlus></FaUserPlus>
          Novo Médico
        </button>
      </div>

      <section className="back">
        <div>
          <p>Lista de Médicos</p>
          <table className="tabela">
            <thead>
              <tr>
                <td>Nome</td>
                <td>CPF</td>
                <td>CRM</td>
                <td>Data Nascimento</td>
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
                  <td data-label="Data Nasc.">
                    {formatarData(medico.dataNasc)}
                  </td>
                  <td data-label="Planos">
                    {medico.planos?.length
                      ? medico.planos.map((plano) => plano.nome).join(", ")
                      : "Nenhum plano"}
                  </td>
                  <td>
                    <div className="acoes-container">
                      <button
                        className="btn-icon btn-icon-1"
                        aria-label="Editar"
                        onClick={() => abrirModalEditar(medico)}
                      >
                        <FaRegEdit></FaRegEdit>
                      </button>
                      <button
                        className="btn-icon btn-icon-2"
                        aria-label="Deletar"
                        onClick={() => abrirConfirmacao(medico)}
                      >
                        <FaRegTrashAlt></FaRegTrashAlt>
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
              medico={medicoSelecionado ?? undefined}
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
          mensagem={`Tem certeza que deseja remover este médico?`}
          onConfirmar={confirmarDelecao}
          onCancelar={fecharConfirmacao}
        />
      )}
    </>
  );
}

export default GestaoMedicos;
