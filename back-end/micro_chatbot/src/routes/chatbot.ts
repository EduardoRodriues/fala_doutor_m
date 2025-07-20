import dotenv from 'dotenv';
dotenv.config();
import { Router, Request, Response } from 'express';
import axios from 'axios';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const services = {
  medicos: 'http://localhost:3000/medicos'
};

router.post('/ask', async (req: Request, res: Response) => {
  const { pergunta } = req.body;
  if (!pergunta) return res.status(400).json({ error: 'pergunta é obrigatória' });
  try {
    const fetches = Object.entries(services).map(async ([key, url]) => {
      const resp = await axios.get(url, { params: { page: 1, limit: 1000 } });
      return { key, data: resp.data };
    });
    const results = await Promise.all(fetches);
    const contexto = results
      .map(r => `Dados de ${r.key}: ${JSON.stringify(r.data)}`)
      .join('\n\n');
    const prompt = `
Você é um assistente que responde perguntas com base nos seguintes dados coletados de outros serviços:

${contexto}

Pergunta: ${pergunta}
`.trim();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }]
    });
    const resposta = completion.choices[0].message?.content || '';
    return res.json({ resposta });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro interno' });
  }
});

export default router;
