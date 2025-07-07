import axios from "axios";
import { RelatorioPaciente } from "../types/pacientes/relatorioPaciente";
import { RelatorioPacientePagination } from "../types/pacientes/relatorioPacientePagination";
import { PacientesPorPlano } from "../types/pacientes/relatorioPacientePorPlano";

export async function filtroPacientesAcimaDe50(
  page: number,
  limit: number
): Promise<RelatorioPacientePagination<RelatorioPaciente>> {
  const skip = (page - 1) * limit;

  const response = await axios.get<
    RelatorioPacientePagination<RelatorioPaciente>
  >("http://localhost:3001/pacientes");
  const pacientes = response.data.data;

  const pacientesAcima50 = pacientes.filter((paciente) => {
    return calcularIdade(paciente.dataNasc) > 50;
  });

  const totalItens = pacientesAcima50.length;
  const totalPaginas = Math.ceil(totalItens / limit);
  const dataPaginada = pacientesAcima50.slice(skip, skip + limit);

  return {
    data: dataPaginada,
    paginaAtual: page,
    totalPaginas,
    totalItens,
  };
}

function calcularIdade(dataNasc: Date): number {
  const nascimento = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export async function pacientesPorPlano(
  page: number,
  limit: number
): Promise<RelatorioPacientePagination<PacientesPorPlano>> {

  const skip = (page - 1) * limit;

  const response = await axios.get<{ data: RelatorioPaciente[] }>("http://localhost:3001/pacientes");
  const pacientes = response.data.data;

  const agrupado = pacientes.reduce((acc, paciente) => {
    const key = paciente.planoId;
    const planoNome = paciente.planoNome;

    if (!acc[key]) {
      acc[key] = {
        planoId: key,
        planoNome: planoNome,
        pacientes: []
      };
    }

    acc[key].pacientes.push(paciente);
    return acc;
  }, {} as Record<number, PacientesPorPlano>);

  const agrupadoArray = Object.values(agrupado);

  const totalItens = agrupadoArray.length;
  const totalPaginas = Math.ceil(totalItens / limit);
  const dataPaginada = agrupadoArray.slice(skip, skip + limit);

  return {
    data: dataPaginada,
    paginaAtual: page,
    totalPaginas,
    totalItens,
  };
}