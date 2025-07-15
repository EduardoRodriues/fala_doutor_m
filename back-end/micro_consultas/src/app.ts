import express from "express";
import ConsultaRoutes from "./web/routes/consultaRoutes";
import { errorHandler } from "./core/middlewares/error/errorHandler";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/consultas", ConsultaRoutes);
app.use(errorHandler);

const PORT = 3004;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
