import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const micro_medicos = { medicos: "http://localhost:3000/medicos" };
const micro_pacientes = { pacientes: "http://localhost:3001/pacientes" };
const micro_planos = { planos: "http://localhost:3002/planos" };
const micro_consultas = { consultas: "http://localhost:3004/consultas" };

export async function perguntasChat(body: { pergunta: string }) {
  const { pergunta } = body;
  if (!pergunta)
    throw new Error("É necessária uma pergunta para obter quaisquer dados!");

  if (pergunta.includes("medicos") || pergunta.includes("medico")) {
    const resposta_medicos = await fetchesMicros(micro_medicos, pergunta);

    return resposta_medicos;
  } else if (pergunta.includes("pacientes") || pergunta.includes("paciente")) {
    const resposta_pacientes = await fetchesMicros(micro_pacientes, pergunta);

    return resposta_pacientes;
  } else if (pergunta.includes("planos") || pergunta.includes("plano")) {
    const resposta_planos = await fetchesMicros(micro_planos, pergunta);

    return resposta_planos;
  } else if (pergunta.includes("consultas") || pergunta.includes("consulta")) {
    const resposta_consultas = await fetchesMicros(micro_consultas, pergunta);
    
    return resposta_consultas;
  } else {
    return "Só podem ser respondidas perguntas relacionadas a aplicação!";
  }
}

async function fetchesMicros(micro: object, pergunta: string) {
  var fetches: any = [];

  fetches = Object.entries(micro).map(async ([key, url]) => {
    const resp = await axios.get(url, { params: { page: 1, limit: 1000 } });
    return { key, data: resp.data };
  });

  const results = await Promise.all(fetches);
  const contexto = results
    .map((r) => `Dados de ${r.key}: ${JSON.stringify(r.data)}`)
    .join("\n\n");

  const prompt = `
Você é um assistente que responde perguntas com base nos seguintes dados coletados de outros serviços:

${contexto}

Pergunta: ${pergunta}
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
  });

  return completion.choices[0].message?.content || "";
}
