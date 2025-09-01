import * as relatorioMedicos from "../controllers/relatorioMedicoController";
import * as relatorioPlanos from "../controllers/relatorioPlanoController";
import * as relatorioPacientes from "../controllers/relatorioPacienteController";
import * as relatorioConsultas from "../controllers/relatorioConsultaController";
import { Router } from "express";

const RelatoriosRoute = Router();

RelatoriosRoute.get("/medicos/excel", relatorioMedicos.baixarExcelMedicos);
RelatoriosRoute.get("/pacientes/excel", relatorioPacientes.baixarExcelPacientesAcima50);
RelatoriosRoute.get("/pacientes/excel/planos", relatorioPacientes.baixarExcelPacientesPorPlano);
RelatoriosRoute.get("/planos/excel", relatorioPlanos.baixarExcelPlanos);
RelatoriosRoute.get("/consultas/excel", relatorioConsultas.baixarExcelConsultas);
RelatoriosRoute.get("/medicos", relatorioMedicos.medicosAcima50);
RelatoriosRoute.get("/pacientes/idade", relatorioPacientes.pacienteAcima50);
RelatoriosRoute.get("/pacientes/planos", relatorioPacientes.relatorioPacientesPorPlano);
RelatoriosRoute.get("/planos", relatorioPlanos.filtroPreco);
RelatoriosRoute.get("/consultas", relatorioConsultas.relatorioConsultas)

export default RelatoriosRoute;
