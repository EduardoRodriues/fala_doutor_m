import type { Consulta } from "../consulta";

export interface FormularioConsultaProps {
  consulta?: Consulta | null;
  onSuccess: () => void;
}