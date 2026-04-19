const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const models = await genAI.listModels();
  console.log(JSON.stringify(models, null, 2));
}

listModels().catch(console.error);
