
const googleService = require('../services/google');

const toolDefinitions = [
  {
    name: 'send_email',
    description: 'Send an email to a recipient with a subject and body.',
    parameters: {
      type: 'OBJECT',
      properties: {
        to: { type: 'STRING', description: 'The email address of the recipient' },
        subject: { type: 'STRING', description: 'The subject of the email' },
        body: { type: 'STRING', description: 'The body content of the email' }
      },
      required: ['to', 'subject', 'body']
    }
  },

  {
    name: 'list_emails',
    description: 'List recent emails from the user\'s inbox, optionally filtered by a query.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Search query for emails (e.g., "from:boss", "subject:meeting")' },
        maxResults: { type: 'INTEGER', description: 'Maximum number of emails to return (default: 5)' }
      },
      required: []
    }
  },
  {
    name: 'get_emails_for_day',
    description: 'Get all emails for a specific date (default: today).',
    parameters: {
      type: 'OBJECT',
      properties: {
        date: { type: 'STRING', description: 'Date in YYYY-MM-DD format (default: today)' },
        maxResults: { type: 'INTEGER', description: 'Maximum emails to return (default: 20)' }
      },
      required: []
    }
  }
];

const executeImpl = async (name, args) => {
  switch (name) {
    case 'send_email':
      return await googleService.sendEmail(args);
    case 'list_emails':
      return await googleService.listEmails(args.query, args.maxResults);
    case 'get_emails_for_day':
      // Construct query for a specific day
      // newer_than:1d is for last 24h, but for a specific calendar day we need after:YYYY/MM/DD before:YYYY/MM/DD+1
      // Gmail search query format: after:2023/01/01 before:2023/01/02
      let afterDate, beforeDate;
      
      if (args.date) {
        const d = new Date(args.date);
        afterDate = d.toISOString().split('T')[0].replace(/-/g, '/');
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);
        beforeDate = nextDay.toISOString().split('T')[0].replace(/-/g, '/');
      } else {
        // Today
        const now = new Date();
        afterDate = now.toISOString().split('T')[0].replace(/-/g, '/');
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        beforeDate = nextDay.toISOString().split('T')[0].replace(/-/g, '/');
      }
      
      const query = `after:${afterDate} before:${beforeDate}`;
      console.log(`[Email MCP] Searching for emails with query: ${query}`);
      return await googleService.listEmails(query, args.maxResults || 20);
      
    default:
      throw new Error(`Tool ${name} not found in Email MCP`);
  }
};

module.exports = {
  toolDefinitions,
  executeImpl
};
