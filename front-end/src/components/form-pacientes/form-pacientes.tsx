import { useEffect, useState, type FormEvent } from "react";
import type { Plano } from "../../types/plano";
import { listarPlanos } from "../../services/planos/listarPlanos";
import "./form-pacientes.css";
import type { Paciente } from "../../types/paciente";
import { editarPaciente } from "../../services/pacientes/editarPaciente";
import { criarPaciente } from "../../services/pacientes/criarPaciente";

interface FormularioPacienteProps {
  paciente?: Paciente;
  onSuccess: () => void;
}

function FormularioPaciente({ paciente, onSuccess }: FormularioPacienteProps) {
  const [nome, setNome] = useState(paciente?.nome ?? "");
  const [cpf, setCpf] = useState(paciente?.cpf ?? "");
  const [dataNasc, setDataNasc] = useState(
    paciente?.dataNasc ? formatarDataParaInput(paciente.dataNasc) : ""
  );
  const [planoId, setPlanoId] = useState<string>(
    paciente?.planoId?.toString() ?? ""
  );
  const [planos, setPlanos] = useState<Plano[]>([]);

  useEffect(() => {
    async function fetchPlanos() {
      const dados = await listarPlanos();
      setPlanos(dados.data);
    }
    fetchPlanos();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const novoPaciente = {
      id: paciente?.id ?? 0,
      nome,
      cpf: cpf.replace(/\D/g, ""),
      dataNasc: formatarDataParaISO(dataNasc),
      planoId: Number(planoId),
    };

    if (paciente) {
      await editarPaciente(novoPaciente);
    } else {
      await criarPaciente(novoPaciente);
    }

    onSuccess();
  }

  function handleCancelar() {
    setNome("");
    setCpf("");
    setDataNasc("");
    setPlanoId("");
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
      <h2>{paciente ? "Editar Paciente" : "Adicionar Novo Paciente"}</h2>
      <p className="subtitulo">
        Preencha os dados abaixo para {paciente ? "editar" : "adicionar"} um
        paciente ao sistema.
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
          Data de Nascimento:
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
          Plano:
          <select
            value={planoId}
            onChange={(e) => setPlanoId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione um plano
            </option>
            {planos.map((plano) => (
              <option key={plano.id} value={plano.id.toString()}>
                {plano.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="botoes-formulario">
        <button type="button" onClick={handleCancelar} className="btn-cancelar">
          Cancelar
        </button>
        <button type="submit" className="btn-cadastrar">
          {paciente ? "Salvar Alterações" : "Cadastrar Paciente"}
        </button>
      </div>
    </form>
  );
}

export default FormularioPaciente;
