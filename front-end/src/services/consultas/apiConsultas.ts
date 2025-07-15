import axios from "axios";
import type { Consulta } from "../../types/consultas/consulta";
import type { ConsultaPaginationResponse } from "../../types/consultas/paginacao/consultaPaginationResponse";

export async function listarConsultas(
  page = 1,
  limit = 10
): Promise<ConsultaPaginationResponse> {
  const response = await axios.get<ConsultaPaginationResponse>(
    `http://localhost:3004/consultas?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function criarConsultas(data: Consulta) {
  const response = await axios.post<Consulta>(
    `http://localhost:3004/consultas`,
    data
  );
  return response.data;
}

export async function editarConsultas(data: Consulta) {
  const response = await axios.put(
    `http://localhost:3004/consultas/${data.id}`,
    data
  );
  return response.data;
}

export async function deletarConsultas(id: number) {
  const response = await axios.delete<Consulta>(
    `http://localhost:3004/consultas/${id}`
  );
  return response.data;
}
