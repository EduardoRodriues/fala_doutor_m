import { Router } from "express";
import * as chatbotController from "../controllers/chatbotController";

const router = Router();

router.post("/ask", chatbotController.perguntasChat);

export default router;
