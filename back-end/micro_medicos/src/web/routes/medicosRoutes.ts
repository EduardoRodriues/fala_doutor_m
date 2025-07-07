import { Router } from "express";
import * as medicoController from "../controllers/medicoController";

const MedicoRoutes = Router();

MedicoRoutes.get("/", medicoController.listarMedicos);
MedicoRoutes.post("/", medicoController.cadastrarMedico);
MedicoRoutes.get("/:id", medicoController.buscarMedicoPorId)
MedicoRoutes.put("/:id", medicoController.atualizarMedico)
MedicoRoutes.delete("/:id", medicoController.deletarMedico);

export default MedicoRoutes;
