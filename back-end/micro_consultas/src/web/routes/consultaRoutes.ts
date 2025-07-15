import { Router } from "express";
import * as consultaController from "../controllers/consultaController";

const ConsultaRoutes = Router();

ConsultaRoutes.get("/", consultaController.listarConsultas);
ConsultaRoutes.get("/:id", consultaController.buscarConsultaPorId);
ConsultaRoutes.post("/", consultaController.cadastrarConsulta);
ConsultaRoutes.put("/:id", consultaController.editarConsulta);
ConsultaRoutes.delete("/:id", consultaController.deletarConsulta);

export default ConsultaRoutes;
