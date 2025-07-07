import express from "express";
import PacienteRoutes from "./web/routes/pacienteRoutes";
import { errorHandler } from "./core/middlewares/error/errorHandler";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/pacientes", PacienteRoutes);
app.use(errorHandler);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
