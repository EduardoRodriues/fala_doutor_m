import * as planoController from "../controllers/planoController";
import { Router } from "express";

const PlanoRoute = Router();

PlanoRoute.get("/", planoController.listarPlanos);
PlanoRoute.post("/", planoController.cadastrarPlano);
PlanoRoute.get("/:id", planoController.buscarPlanoPorId);
PlanoRoute.put("/:id", planoController.atualizarPlano);
PlanoRoute.delete("/:id", planoController.deletarPlano);

export default PlanoRoute;
