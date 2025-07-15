import type { Paciente } from "../paciente";

export interface FormularioPacienteProps {
  paciente?: Paciente;
  onSuccess: () => void;
}