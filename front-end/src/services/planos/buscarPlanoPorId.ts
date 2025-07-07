import axios from "axios";

export async function buscarPlano(id: number) {
  const response = await axios.get(`http://localhost:3002/planos/${id}`);
  return response.data;
}
