import * as relatorioMedicos from "../controllers/relatorioMedicoController";
import * as relatorioPlanos from "../controllers/relatorioPlanoController";
import * as relatorioPacientes from "../controllers/relatorioPacienteController";
import * as relatorioConsultas from "../controllers/relatorioConsultaController";
import { Router } from "express";

const RelatoriosRoute = Router();

RelatoriosRoute.get("/medicos", relatorioMedicos.medicosAcima50);
RelatoriosRoute.get("/pacientes/idade", relatorioPacientes.pacienteAcima50);
RelatoriosRoute.get("/pacientes/planos", relatorioPacientes.relatorioPacientesPorPlano);
RelatoriosRoute.get("/planos", relatorioPlanos.filtroPreco);
RelatoriosRoute.get("/consultas", relatorioConsultas.relatorioConsultas)

export default RelatoriosRoute;
