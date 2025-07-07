import type { Plano } from "../../types/plano";
import axios from "axios";

export async function criarPlano(plano: Plano) {
  const response = await axios.post<Plano>(
    "http://localhost:3002/planos",
    plano
  );
  return response.data;
}
