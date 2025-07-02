import express from "express";
import PacienteRoutes from "./web/routes/pacienteRoutes";
import { errorHandler } from "./core/middlewares/error/errorHandler";

const app = express();

app.use(express.json());
app.use("/pacientes", PacienteRoutes);
app.use(errorHandler);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
