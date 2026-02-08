
const googleService = require('../services/google');

const toolDefinitions = [
  {
    name: 'list_calendar_events',
    description: 'List upcoming calendar events.',
    parameters: {
      type: 'OBJECT',
      properties: {
        timeMin: { type: 'STRING', description: 'Start time (ISO string) to list events from (default: now)' },
        timeMax: { type: 'STRING', description: 'End time (ISO string) to list events until' },
        maxResults: { type: 'INTEGER', description: 'Maximum number of events to return' }
      },
      required: []
    }
  },
  {
    name: 'create_calendar_event',
    description: 'Create a new event in the calendar.',
    parameters: {
      type: 'OBJECT',
      properties: {
        summary: { type: 'STRING', description: 'Title of the event' },
        description: { type: 'STRING', description: 'Description of the event' },
        startTime: { type: 'STRING', description: 'Start time of the event (ISO string)' },
        endTime: { type: 'STRING', description: 'End time of the event (ISO string)' }
      },
      required: ['summary', 'startTime', 'endTime']
    }
  }
];

const executeImpl = async (name, args) => {
  switch (name) {
    case 'list_calendar_events':
      return await googleService.listEvents(args.timeMin, args.timeMax, args.maxResults);
    case 'create_calendar_event':
      return await googleService.createEvent(args);
    default:
      throw new Error(`Tool ${name} not found in Calendar MCP`);
  }
};

module.exports = {
  toolDefinitions,
  executeImpl
};
