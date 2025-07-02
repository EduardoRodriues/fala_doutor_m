import { Router } from "express";
import * as pacienteController from "../controllers/pacienteController";

const PacienteRoutes = Router();

PacienteRoutes.get("/", pacienteController.listarTodos);
PacienteRoutes.get("/:id", pacienteController.buscarPacientePorId);
PacienteRoutes.post("/", pacienteController.cadastrarPaciente);
PacienteRoutes.put("/:id", pacienteController.atualizarPaciente);
PacienteRoutes.delete("/:id", pacienteController.deletarpaciente);

export default PacienteRoutes;
