import axios from "axios";
import { RelatorioPlano } from "../types/planos/relatorioPlano";
import { RelatorioPlanoPagination } from "../types/planos/relatorioPlanoPagination";

export async function filtroPrecosPlanos(
  page: number,
  limit: number,
  precoMinimo: number
): Promise<RelatorioPlanoPagination<RelatorioPlano>> {
  const skip = (page - 1) * limit;

  const response = await axios.get<RelatorioPlanoPagination<RelatorioPlano>>(
    "http://localhost:3002/planos"
  );

  const planos = response.data.data;

  const planosFiltrados = planos.filter((plano) => {
    const precoNumero = Number(plano.preco);
    return precoNumero >= precoMinimo;
  });

  const totalItens = planosFiltrados.length;
  const totalPaginas = Math.ceil(totalItens / limit);
  const dataPaginada = planosFiltrados.slice(skip, skip + limit);

  return {
    data: dataPaginada,
    paginaAtual: page,
    totalPaginas,
    totalItens,
  };
}
