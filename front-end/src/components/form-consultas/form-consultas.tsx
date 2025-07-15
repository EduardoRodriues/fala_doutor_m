import { useEffect, useState, type FormEvent } from "react";
import type { Plano } from "../../types/planos/plano";
import type { Paciente } from "../../types/pacientes/paciente";
import type { Medico } from "../../types/medicos/medico";
import "../global/css/index-form.css";
import { listarMedicos } from "../../services/medicos/apiMedicos";
import { listarPacientes } from "../../services/pacientes/apiPacientes";
import { listarPlanos } from "../../services/planos/apiPlanos";
import { criarConsultas, editarConsultas } from "../../services/consultas/apiConsultas";
import type { FormularioConsultaProps } from "../../types/consultas/forms/from-prop-consulta";

function FormularioConsultas({ consulta, onSuccess }: FormularioConsultaProps) {
  const [medicoId, setMedicoId] = useState(consulta?.medicoId.toString() ?? "");
  const [pacienteId, setPacienteId] = useState(
    consulta?.pacienteId.toString() ?? ""
  );
  const [dataConsulta, setDataConsulta] = useState(
    consulta?.dataConsulta ? formatarDataParaInput(consulta.dataConsulta) : ""
  );
  const [, setPlanos] = useState<Plano[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [resPlanos, resPacientes, resMedicos] = await Promise.all([
        listarPlanos(),
        listarPacientes(1, 1000),
        listarMedicos(1, 1000),
      ]);
      setPlanos(resPlanos.data);
      setPacientes(resPacientes.data);
      setMedicos(resMedicos.data);
      setPacientesFiltrados(resPacientes.data); 
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!medicoId) return;

    const medicoSelecionado = medicos.find(
      (m) => m.id.toString() === medicoId
    );

    if (!medicoSelecionado) {
      setPacientesFiltrados([]);
      return;
    }

    const planosDoMedico = medicoSelecionado.planoIds;
    const pacientesCompativeis = pacientes.filter((paciente) =>
      planosDoMedico.includes(paciente.planoId)
    );

    setPacientesFiltrados(pacientesCompativeis);
  }, [medicoId, pacientes, medicos]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const dataConsultaISO = formatarDataParaISO(dataConsulta);

    const novaConsulta = {
      id: consulta?.id ?? 0,
      medicoId: Number(medicoId),
      pacienteId: Number(pacienteId),
      dataConsulta: dataConsultaISO,
    };

    if (consulta) {
      await editarConsultas(novaConsulta);
    } else {
      await criarConsultas(novaConsulta);
    }

    onSuccess();
  }

  function handleCancelar() {
    setMedicoId("");
    setPacienteId("");
    setDataConsulta("");
    onSuccess();
  }

  function handleDataConsultaChange(value: string) {
    let v = value.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 4) {
      v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    setDataConsulta(v);
  }

  function formatarDataParaInput(isoData: string) {
    const [ano, mes, dia] = isoData.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataParaISO(data: string) {
    const partes = data.split("/");
    if (partes.length !== 3) return "";
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T00:00:00.000Z`;
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>{consulta ? "Editar Consulta" : "Adicionar Nova Consulta"}</h2>
      <p className="subtitulo">
        Preencha os dados abaixo para {consulta ? "editar" : "agendar"} uma
        consulta.
      </p>

      <div className="campos-duas-colunas com-espaco-entre">
        <label>
          Médico:
          <select
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione um médico
            </option>
            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id.toString()}>
                {medico.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Paciente:
          <select
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione um paciente
            </option>
            {pacientesFiltrados.map((paciente) => (
              <option key={paciente.id} value={paciente.id.toString()}>
                {paciente.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data da Consulta:
          <input
            type="text"
            value={dataConsulta}
            onChange={(e) => handleDataConsultaChange(e.target.value)}
            maxLength={10}
            placeholder="dd/mm/aaaa"
            required
          />
        </label>
      </div>

      <div className="botoes-formulario">
        <button type="button" onClick={handleCancelar} className="btn-cancelar">
          Cancelar
        </button>
        <button type="submit" className="btn-cadastrar">
          {consulta ? "Salvar Alterações" : "Cadastrar Consulta"}
        </button>
      </div>
    </form>
  );
}

export default FormularioConsultas;
