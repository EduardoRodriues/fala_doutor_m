import type { Plano } from "../../types/plano";
import axios from "axios";

export async function deletarPlanos(id: number) {
  const response = await axios.delete<Plano>(`http://localhost:3002/planos/${id}`);
  return response.data;
}
