import express from "express";
import PlanoRoute from "./web/routes/planoRoute";
import { errorHandler } from "./core/middlewares/error/errorHandler";

const app = express();

app.use(express.json());
app.use("/planos", PlanoRoute);
app.use(errorHandler);

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
