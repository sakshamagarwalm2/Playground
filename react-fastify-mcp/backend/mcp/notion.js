
const notionService = require('../services/notion');

const toolDefinitions = [
  {
    name: 'search_notion_pages',
    description: 'Search for pages in Notion workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Search query' }
      },
      required: ['query']
    }
  },
  {
    name: 'create_notion_page',
    description: 'Create a new page in Notion.',
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'Title of the new page' },
        content: { 
          type: 'ARRAY', 
          description: 'Array of text paragraphs to add to the page',
          items: { type: 'STRING' }
        }
      },
      required: ['title']
    }
  },

  {
    name: 'get_notion_page_summary',
    description: 'Get a summary/content of the main dashboard page.',
    parameters: {
      type: 'OBJECT',
      properties: {},
      required: []
    }
  },
  {
    name: 'add_knowledge_to_page',
    description: 'Add a new block of knowledge (text) to the choose/default Notion page.',
    parameters: {
      type: 'OBJECT',
      properties: {
        text: { type: 'STRING', description: 'The text content to add to the page.' },
        pageId: { type: 'STRING', description: 'Optional: Specific Page ID to add to. Defaults to the environment configured page.' }
      },
      required: ['text']
    }
  }
];

const executeImpl = async (name, args) => {
  switch (name) {
    case 'search_notion_pages':
      return await notionService.searchPages(args.query);
    case 'create_notion_page':
      return await notionService.createPage(args.title, args.content);
    case 'get_notion_page_summary':
      return await notionService.getPages();
    case 'add_knowledge_to_page':
      return await notionService.appendToPage(args.pageId, [args.text]);
    default:
      throw new Error(`Tool ${name} not found in Notion MCP`);
  }
};

module.exports = {
  toolDefinitions,
  executeImpl
};
