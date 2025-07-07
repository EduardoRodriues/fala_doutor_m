import { useEffect, useState, type FormEvent } from "react";
import type { Medico } from "../../types/medico";
import type { Plano } from "../../types/plano";
import { criarMedico } from "../../services/medicos/criarMedicos";
import { editarMedico } from "../../services/medicos/editarMedico";
import { listarPlanos } from "../../services/planos/listarPlanos";
import "./formulario-medico.css";

interface FormularioMedicoProps {
  medico?: Medico;
  onSuccess: () => void;
}

function FormularioMedico({ medico, onSuccess }: FormularioMedicoProps) {
  const [nome, setNome] = useState(medico?.nome ?? "");
  const [cpf, setCpf] = useState(medico?.cpf ?? "");
  const [crm, setCrm] = useState(medico?.crm ?? "");
  const [dataNasc, setDataNasc] = useState(
    medico?.dataNasc ? formatarDataParaInput(medico.dataNasc) : ""
  );
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [planosSelecionados, setPlanosSelecionados] = useState<Plano[]>(() => {
    if (medico?.planos) {
      return medico.planos;
    }
    return [];
  });

  useEffect(() => {
    async function fetchPlanos() {
      const dados = await listarPlanos();
      setPlanos(dados.data);
    }
    fetchPlanos();
  }, []);

  function adicionarPlano(id: string) {
    const plano = planos.find((p) => p.id.toString() === id);
    if (plano && !planosSelecionados.some((p) => p.id === plano.id)) {
      setPlanosSelecionados([...planosSelecionados, plano]);
    }
  }

  function removerPlano(id: number) {
    setPlanosSelecionados(planosSelecionados.filter((p) => p.id !== id));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const novoMedico = {
      id: medico?.id ?? 0,
      nome,
      cpf: cpf.replace(/\D/g, ""),
      crm,
      dataNasc: formatarDataParaISO(dataNasc),
      planoIds: planosSelecionados.map((p) => p.id),
    };

    if (medico) {
      await editarMedico(novoMedico);
    } else {
      await criarMedico(novoMedico);
    }

    onSuccess();
  }

  function handleCancelar() {
    setNome("");
    setCpf("");
    setCrm("");
    setDataNasc("");
    setPlanosSelecionados([]);
    onSuccess();
  }

  function handleCpfChange(value: string) {
    let v = value.replace(/\D/g, "");
    v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    setCpf(v);
  }

  function handleDataNascChange(value: string) {
    let v = value.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 4) {
      v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    setDataNasc(v);
  }

  function formatarDataParaInput(isoData: string) {
    const [ano, mes, dia] = isoData.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataParaISO(data: string) {
    const partes = data.split("/");
    if (partes.length !== 3) return "";
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  return (
    <form className="formulario-medico" onSubmit={handleSubmit}>
      <h2>{medico ? "Editar Médico" : "Adicionar Novo Médico"}</h2>
      <p className="subtitulo">
        Preencha os dados abaixo para {medico ? "editar" : "adicionar"} um
        médico ao sistema.
      </p>

      <div className="campos-duas-colunas com-espaco-entre">
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

        <label>
          CPF:
          <input
            type="text"
            value={cpf}
            onChange={(e) => handleCpfChange(e.target.value)}
            maxLength={14}
            required
          />
        </label>

        <label>
          CRM:
          <input
            type="text"
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
            required
          />
        </label>

        <label>
          Data de Nasciemnto:
          <input
            type="text"
            value={dataNasc}
            onChange={(e) => handleDataNascChange(e.target.value)}
            maxLength={10}
            placeholder="dd/mm/aaaa"
            required
          />
        </label>

        <label>
          Planos:
          <select
            value=""
            onChange={(e) => {
              adicionarPlano(e.target.value);
            }}
          >
            <option value="" disabled>
              Selecione um plano
            </option>
            {planos
              .filter((p) => !planosSelecionados.some((sel) => sel.id === p.id))
              .map((plano) => (
                <option key={plano.id} value={plano.id.toString()}>
                  {plano.nome}
                </option>
              ))}
          </select>
          {planosSelecionados.length > 0 && (
            <div className="planos-selecionados-container">
              <p className="label-planos-selecionados">Planos Selecionados:</p>
              <div className="planos-selecionados">
                {planosSelecionados.map((plano) => (
                  <span key={plano.id} className="plano-item">
                    {plano.nome}
                    <button
                      type="button"
                      aria-label={`Remover plano ${plano.nome}`}
                      onClick={() => removerPlano(plano.id)}
                      className="btn-remover-plano"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </label>
      </div>

      <div className="botoes-formulario">
        <button type="button" onClick={handleCancelar} className="btn-cancelar">
          Cancelar
        </button>
        <button type="submit" className="btn-cadastrar">
          {medico ? "Salvar Alterações" : "Cadastrar Médico"}
        </button>
      </div>
    </form>
  );
}

export default FormularioMedico;
