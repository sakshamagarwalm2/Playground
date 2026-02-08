const fastify = require('fastify')({ logger: true });
const path = require('path');
require('dotenv').config();

// Register CORS to allow requests from mobile app (and any origin for development)
fastify.register(require('@fastify/cors'), {
  origin: '*', // In production, replace with specific origins
});

// Register Routes
fastify.register(require('./routes/auth'));
fastify.register(require('./routes/test'));
fastify.register(require('./routes/api'));

// Hello World route
fastify.get('/', async (request, reply) => {
  return { hello: 'world', from: 'Fastify Backend' };
});

// A simple data route to test fetching
fastify.get('/api/data', async (request, reply) => {
  return {
    id: 1,
    name: 'Sample Data',
    description: 'This data comes from the Fastify backend!',
    timestamp: new Date().toISOString(),
  };
});


// Import services and MCPs
const geminiService = require('./services/gemini');
const emailMcp = require('./mcp/email');
const calendarMcp = require('./mcp/calendar');
const notionMcp = require('./mcp/notion');

// Map of all enabled MCPs
const mcpTools = {
  email: emailMcp,
  calendar: calendarMcp,
  notion: notionMcp
};

// Chat route

// Chat route with streaming
fastify.post('/api/chat', async (request, reply) => {
  const { message, history } = request.body;
  

  reply.raw.setHeader('Content-Type', 'application/x-ndjson');
  reply.raw.setHeader('Transfer-Encoding', 'chunked');
  reply.raw.setHeader('Access-Control-Allow-Origin', '*'); // Explicitly set CORS for streaming

  try {
    const generator = geminiService.chatWithGeminiStream(message, history, mcpTools);
    
    for await (const chunk of generator) {
        reply.raw.write(JSON.stringify(chunk) + '\n');
    }
    
    reply.raw.end();
  } catch (error) {
    request.log.error(error);
    // If headers haven't been sent, we can send a 500. 
    // If streaming started, we might need to send a specific error chunk.
    if (!reply.raw.headersSent) {
        reply.status(500).send({ error: error.message });
    } else {
        reply.raw.write(JSON.stringify({ type: 'error', message: error.message }) + '\n');
        reply.raw.end();
    }
  }
});

// Run the server!
const start = async () => {
  try {
    // Listen on 0.0.0.0 to be accessible from other devices on the network
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
