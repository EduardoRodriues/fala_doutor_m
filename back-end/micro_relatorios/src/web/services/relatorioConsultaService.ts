import axios from "axios";
import { RelatorioConsultaDTO } from "../types/consultas/relatorioConsulta";
import { RelatorioConsultaPagination } from "../types/consultas/relatorioConsultaPagination";

export async function gerarRelatorioConsultas(
  page: number,
  limit: number
): Promise<RelatorioConsultaPagination<RelatorioConsultaDTO>> {
  const skip = (page - 1) * limit;

  const response = await axios.get<ConsultasResponse>("http://localhost:3004/consultas");

  const consultas = response.data.data;

  const agrupado: Record<string, RelatorioConsultaDTO> = {};

  consultas.forEach((consulta) => {
    const { medicoNome, pacienteNome } = consulta;

    if (!agrupado[medicoNome]) {
      agrupado[medicoNome] = { medicoNome, pacientesNome: [] };
    }

    if (!agrupado[medicoNome].pacientesNome.includes(pacienteNome)) {
      agrupado[medicoNome].pacientesNome.push(pacienteNome);
    }
  });

  const relatorioArray = Object.values(agrupado);

  const totalItens = relatorioArray.length;
  const totalPaginas = Math.ceil(totalItens / limit);
  const dataPaginada = relatorioArray.slice(skip, skip + limit);

  return {
    data: dataPaginada,
    paginaAtual: page,
    totalPaginas,
    totalItens,
  };
}
