import { useCallback, useEffect, useState, type JSX } from "react";
import type { Paciente } from "../../types/pacientes/paciente";
import type { Plano } from "../../types/planos/plano";
import Confirmacao from "../../components/confirmacao/confirmacao";
import FormularioPacientes from "../../components/form-pacientes/form-pacientes";
import "../global/css/index-gestao.css";
import {
  deletarPaciente,
  listarPacientes,
} from "../../services/pacientes/apiPacientes";
import { listarPlanos } from "../../services/planos/apiPlanos";
import { FaRegEdit, FaRegTrashAlt, FaUserPlus } from "react-icons/fa";

function GestaoPacientes(): JSX.Element {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<
    Paciente | undefined
  >(undefined);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [pacientParaDeletar, setPacienteParaDeletar] =
    useState<Paciente | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limit, setLimit] = useState(10);

  async function fetchPlanos() {
    const resposta = await listarPlanos(1, 1000);
    setPlanos(resposta.data);
  }

  const fecthPacientes = useCallback(
    async (page = 1, limitAtual = limit) => {
      const resposta = await listarPacientes(page, limitAtual);
      const pacientesComPlanoNome = resposta.data.map((paciente) => {
        const planoEncontrado = planos.find((p) => p.id === paciente.planoId);
        return {
          ...paciente,
          plano: planoEncontrado ?? {
            id: 0,
            nome: "—",
            descricao: "",
            preco: 0,
          },
        };
      });

      setPacientes(pacientesComPlanoNome);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
    },
    [limit, planos]
  );

  useEffect(() => {
    fetchPlanos();
  }, [paginaAtual, limit]);

  useEffect(() => {
    if (planos.length > 0) {
      fecthPacientes(paginaAtual, limit);
    }
  }, [paginaAtual, limit, fecthPacientes, planos.length]);

  function abrirModalNovo() {
    setPacienteSelecionado(undefined);
    setModalAberto(true);
  }

  function abrirModalEditar(paciente: Paciente) {
    setPacienteSelecionado(paciente);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function abrirConfirmacao(paciente: Paciente) {
    setPacienteParaDeletar(paciente);
    setConfirmacaoAberta(true);
  }

  function fecharConfirmacao() {
    setPacienteParaDeletar(null);
    setConfirmacaoAberta(false);
  }

  async function confirmarDelecao() {
    if (pacientParaDeletar) {
      await deletarPaciente(pacientParaDeletar.id);
      fecthPacientes(paginaAtual, limit);
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
        <h1>Gerenciamento de Pacientes</h1>
        <button className="btn-novo" onClick={abrirModalNovo}>
          <FaUserPlus></FaUserPlus>
          Novo Paciente
        </button>
      </div>

      <section className="back">
        <div>
          <div>
            <p>Lista de Pacientes</p>
          </div>
          <table className="tabela">
            <thead>
              <tr>
                <td>Nome</td>
                <td>CPF</td>
                <td>Data Nascimento</td>
                <td>Plano</td>
                <td>Ações</td>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td data-label="Nome">{paciente.nome}</td>
                  <td data-label="CPF">{formatarCpf(paciente.cpf)}</td>
                  <td data-label="DataNasc">
                    {formatarData(paciente.dataNasc)}
                  </td>
                  <td data-label="Plano">{paciente.plano?.nome}</td>
                  <td>
                    <div className="acoes-container">
                      <button
                        className="btn-icon btn-icon-1"
                        aria-label="Editar"
                        onClick={() => abrirModalEditar(paciente)}
                      >
                        <FaRegEdit></FaRegEdit>
                      </button>
                      <button
                        className="btn-icon btn-icon-2"
                        aria-label="Deletar"
                        onClick={() => abrirConfirmacao(paciente)}
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
            <FormularioPacientes
              paciente={pacienteSelecionado}
              onSuccess={() => {
                fecharModal();
                fecthPacientes(paginaAtual, limit);
              }}
            />
          </div>
        </div>
      )}

      {confirmacaoAberta && pacientParaDeletar && (
        <Confirmacao
          mensagem={`Tem certeza que deseja remover este paciente: ${pacientParaDeletar.nome}?`}
          onConfirmar={confirmarDelecao}
          onCancelar={fecharConfirmacao}
        />
      )}
    </>
  );
}

export default GestaoPacientes;
