import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import chatbotRouter from "./routes/chatbotRouter";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/chatbot", chatbotRouter);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Chatbot microservice running on port ${PORT}`);
});
