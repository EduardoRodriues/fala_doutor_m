
import axios from "axios";
import type { Plano } from "../../types/planos/plano";
import type { PlanosPaginationResponse } from "../../types/planos/paginacao/planoPaginationResponse";

export async function listarPlanos(
  page = 1,
  limit = 10
): Promise<PlanosPaginationResponse> {
  const response = await axios.get<PlanosPaginationResponse>(
    `http://localhost:3002/planos?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function buscarPlano(id: number) {
  const response = await axios.get(`http://localhost:3002/planos/${id}`);
  return response.data;
}

export async function criarPlano(plano: Plano) {
  const response = await axios.post<Plano>(
    "http://localhost:3002/planos",
    plano
  );
  return response.data;
}

export async function editarPlano(plano: Plano) {
  const response = await axios.put(
    `http://localhost:3002/planos/${plano.id}`,
    plano
  );

  return response.data;
}

export async function deletarPlanos(id: number) {
  const response = await axios.delete<Plano>(
    `http://localhost:3002/planos/${id}`
  );
  return response.data;
}
