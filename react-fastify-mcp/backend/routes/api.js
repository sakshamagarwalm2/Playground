const googleService = require('../services/google');
const notionService = require('../services/notion');

async function apiRoutes(fastify, options) {
  
  // Get recent emails
  fastify.get('/api/emails', async (request, reply) => {
    try {
      const emails = await googleService.getRecentEmails();
      return { success: true, emails };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Get today's calendar events
  fastify.get('/api/calendar', async (request, reply) => {
    try {
      const events = await googleService.getUpcomingEvents();
      return { success: true, events };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Get Notion pages (we'll need to add this to notion service)
  fastify.get('/api/knowledge', async (request, reply) => {
    try {
      const pages = await notionService.getPages();
      return { success: true, pages };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

}

module.exports = apiRoutes;
