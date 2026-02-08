const googleService = require('../services/google');
const notionService = require('../services/notion');

async function testRoutes(fastify, options) {
  
  // Test 1: Get recent emails
  fastify.get('/test/gmail', async (request, reply) => {
    try {
      const emails = await googleService.getRecentEmails();
      return { success: true, count: emails.length, emails };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Test 2: Get upcoming calendar events
  fastify.get('/test/calendar', async (request, reply) => {
    try {
      const events = await googleService.getUpcomingEvents();
      return { success: true, count: events.length, events };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Test 3: Create a Notion page
  fastify.get('/test/notion', async (request, reply) => {
    try {
      const page = await notionService.createTestPage();
      return { success: true, pageId: page.id, url: page.url };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

}

module.exports = testRoutes;
