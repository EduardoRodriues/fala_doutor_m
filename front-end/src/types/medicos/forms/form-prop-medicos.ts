import type { Medico } from "../medico";

export interface FormularioMedicoProps {
  medico?: Medico;
  onSuccess: () => void;
}