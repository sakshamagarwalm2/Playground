
// test/list_models_v2.js
const { GoogleGenerativeAI } = require(require.resolve('@google/generative-ai', { paths: [__dirname + '/../backend'] }));
const path = require('path');
require(require.resolve('dotenv', { paths: [__dirname + '/../backend'] })).config({ path: path.join(__dirname, '../backend/.env') });

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API Key not found');
    return;
  }
  
  // Direct fetch to list models
  try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await response.json();
      
      if (data.models) {
          console.log('Available Models:');
          data.models.forEach(m => {
              console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
          });
      } else {
          console.log('No models found or error:', data);
      }
  } catch(e) {
      console.error('Error fetching models:', e);
  }
}

main();
