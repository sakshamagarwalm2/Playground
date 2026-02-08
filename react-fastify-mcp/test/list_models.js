
// test/list_models.js
const { GoogleGenerativeAI } = require(require.resolve('@google/generative-ai', { paths: [__dirname + '/../backend'] }));
const path = require('path');
// Use the dotenv from backend
require(require.resolve('dotenv', { paths: [__dirname + '/../backend'] })).config({ path: path.join(__dirname, '../backend/.env') });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('Fetching available models...');

    // Try a few known candidates
     const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro"
     ];
     
     for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello?");
            const response = await result.response;
            console.log(`✅ Success!`);
        } catch (e) {
            console.log(`❌ Failed: ${e.message.split('\n')[0]}`);
        }
     }
}

listModels().catch(console.error);
