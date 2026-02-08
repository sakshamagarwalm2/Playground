const googleService = require('../services/google');

async function authRoutes(fastify, options) {
  
  // 1. Redirect to Google
  fastify.get('/auth/google', async (request, reply) => {
    const url = googleService.getAuthUrl();
    reply.redirect(url);
  });

  // 2. Callback from Google
  fastify.get('/auth/google/callback', async (request, reply) => {
    const { code } = request.query;
    if (!code) {
      return reply.code(400).send({ error: 'No code provided' });
    }
    
    try {
      await googleService.setCredentials(code);
      // Serve a nice HTML page instead of JSON
      reply.type('text/html').send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #10b981; margin-bottom: 20px;">✓ Connected!</h1>
              <p style="color: #374151; font-size: 18px; line-height: 1.5;">
                Google Authentication was successful.<br/>
                You can now close this window and return to <b>FlowPilot</b>.
              </p>
            </div>
            <script>
              // Try to close the window automatically
              setTimeout(() => {
                window.opener = null;
                // window.close(); 
              }, 2000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Authentication failed', details: error.message });
    }
  });

}

module.exports = authRoutes;
