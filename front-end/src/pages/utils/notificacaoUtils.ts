import type { Consulta } from "../../types/consultas/consulta";

export function filtrarConsultasHoje(consultas: Consulta[]): Consulta[] {
  const hoje = new Date();
  return consultas.filter((c) => {
    const data = new Date(c.dataConsulta);
    return (
      data.getUTCDate() === hoje.getDate() &&
      data.getUTCMonth() === hoje.getMonth() &&
      data.getUTCFullYear() === hoje.getFullYear()
    );
  });
}
