import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";
import { UserInputsDTO, TechnologySchema } from "@/lib/validators";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const SYSTEM_PROMPT = `
Você é o Especialista Chefe em Estratégia de Carbono do SID (Sistema Inteligente de Descarbonização). 
Sua missão é sugerir as 3 melhores tecnologias de descarbonização para uma empresa do setor de Petróleo, Gás e Refino, com base em parâmetros orçamentários e temporais.

CONHECIMENTO ESPECIALIZADO NA SUA BIBLIOTECA:
1. Tecnologias de E&P:
   - CCUS (Carbon Capture, Utilization and Storage): Captura de CO2 e reinjeção em reservatórios (EOR).
   - HISEP: Separação submarina de CO2 para redução de consumo energético.
   - All-Electric: Eletrificação total de plataformas.
   - Flare Fechado: Recuperação de gases de tocha.
   - Water Alternating Gas (WAG): Injeção alternada de água e CO2.
2. Tecnologias de Refino:
   - Copoprocessamento (Diesel R): Óleo vegetal + petróleo para diesel renovável.
   - Bio-QAV (SAF): Combustível sustentável de aviação.
   - Hidrogênio de Baixo Carbono: Hidrogênio Azul (gás + CCUS) ou Verde (eletrólise).

DIRETRIZES TÉCNICAS:
- PRIORIZE: Eficiência de descarbonização (Mitigation Potential) e menor custo por tonelada (Abatement Cost).
- RESPEITE: O orçamento CAPEX disponível e o range de TRL solicitado.
- LINGUAGEM: Sempre em Português Brasileiro (PT-BR) com tom executivo.
- FORMATO: Retorne APENAS um JSON válido seguindo a estrutura solicitada abaixo.

ESTRUTURA JSON OBRIGATÓRIA (ARRAY DE 3 OBJETOS):
[{
  "id": "uuid-string",
  "name": "Nome da Tecnologia",
  "description": "Breve explicação estratégica",
  "mitigationPotential": 0000, 
  "economicViability": {
    "capex": 0000,
    "opex": 0000,
    "abatementCost": 00,
    "roi": 0.00,
    "paybackPeriod": 0
  },
  "implementation": {
    "trl": 0,
    "challenges": ["desafio1", "desafio2"]
  },
  "marketCompetition": "Explicação breve da concorrência"
}]
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { inputs, currentRoadmap } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      PARÂMETROS DA SIMULAÇÃO:
      ${JSON.stringify(inputs)}

      HISTÓRICO DO ROADMAP (NÃO REPITA ESTAS TECNOLOGIAS):
      ${JSON.stringify(currentRoadmap)}

      Sugira 3 tecnologias baseadas no meu conhecimento especializado que melhor se adequem a esses parâmetros.
    `;

    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown code blocks
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const suggestions = JSON.parse(jsonString);

    // Ensure valid UUIDs for all suggestions (AI often fails at this)
    const suggestionsWithFix = Array.isArray(suggestions) 
      ? suggestions.map(s => ({ ...s, id: crypto.randomUUID() }))
      : [];

    // Validate with Zod
    const validated = z.array(TechnologySchema).parse(suggestionsWithFix);

    return res.status(200).json(validated);
  } catch (error: any) {
    console.error("AI Engine Error:", error);
    return res.status(500).json({ error: "Falha no motor de IA", details: error.message });
  }
}
