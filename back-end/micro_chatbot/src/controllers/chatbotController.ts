import { Request, Response } from "express";
import * as chatbotService from "../services/chatbotService";

export async function perguntasChat(req: Request, res: Response) {
  try {
    const resposta = await chatbotService.perguntasChat(req.body);
    res.status(200).json({ resposta });
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Erro ao responder pergunta!" });
  }
}
