import axios from "axios";
import type { ChatbotPergunta } from "../../types/chatbot/chatbotPergunta";
import type { ChatbotResposta } from "../../types/chatbot/chatbotResposta";

export async function conversachat(pergunta: ChatbotPergunta): Promise<ChatbotResposta> {
  const response = await axios.post<ChatbotResposta>("http://localhost:3005/chatbot/ask", pergunta);
  return response.data;
}

