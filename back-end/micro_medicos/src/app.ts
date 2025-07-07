import express from "express";
import cors from "cors";
import MedicoRoutes from "./web/routes/medicosRoutes";
import { errorHandler } from "./core/middlewares/errors/errorHandler";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/medicos", MedicoRoutes);
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
