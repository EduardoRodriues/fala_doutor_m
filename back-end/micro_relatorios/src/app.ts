import express from "express";
import cors from "cors";
import RelatorioRoutes from "./web/routes/relatoriosRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/relatorios", RelatorioRoutes);

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
