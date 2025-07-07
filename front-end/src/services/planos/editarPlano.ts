import type { Plano } from "../../types/plano";
import axios from "axios";

export async function editarPlano(plano: Plano,) {
  const response = await axios.put(`http://localhost:3002/planos/${plano.id}`, plano);

  return response.data;
}
