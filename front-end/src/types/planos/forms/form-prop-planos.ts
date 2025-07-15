import type { Plano } from "../plano";

export interface FormularioPlanoProps {
  plano?: Plano;
  onSuccess: () => void;
}