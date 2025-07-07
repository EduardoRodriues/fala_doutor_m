import axios from "axios";
import { RelatorioMedico } from "../types/medicos/relatorioMedico";
import { RelatorioMedicoPagination } from "../types/medicos/relatorioMedicoPagination";

export async function filtroMedicosAcima50Anos(
  page: number,
  limit: number
): Promise<RelatorioMedicoPagination<RelatorioMedico>> {
  const skip = (page - 1) * limit;

  const response = await axios.get<RelatorioMedicoPagination<RelatorioMedico>>(
    "http://localhost:3000/medicos"
  );

  const medicos = response.data.data;

  const medicosAcima50 = medicos.filter((medico) => {
    return calcularIdade(medico.dataNasc) > 50;
  });

  const totalItens = medicosAcima50.length;
  const totalPaginas = Math.ceil(totalItens / limit);
  const dataPaginada = medicosAcima50.slice(skip, skip + limit);

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
