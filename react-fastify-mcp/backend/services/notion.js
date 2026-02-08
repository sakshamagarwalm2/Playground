const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_KEY });

const createTestPage = async () => {
  if (!process.env.NOTION_KEY) throw new Error('NOTION_KEY is missing');
  
  const parentId = process.env.NOTION_PAGE_ID;
  if (!parentId) throw new Error('NOTION_PAGE_ID is missing in .env');

  const response = await notion.pages.create({
    parent: { page_id: parentId }, 
    properties: {
      title: {
        title: [
          {
            text: {
              content: 'FlowPilot Test Page',
            },
          },
        ],
      },
    },
    children: [
      {
        object: 'block',
        paragraph: {
          rich_text: [
            {
              text: {
                content: 'This is a test page created by FlowPilot backend.',
              },
            },
          ],
        },
      },
    ],
  });
  return response;
};

// Get the parent page info and its content
const getPages = async () => {
  if (!process.env.NOTION_KEY) throw new Error('NOTION_KEY is missing');
  const parentId = process.env.NOTION_PAGE_ID;
  if (!parentId) throw new Error('NOTION_PAGE_ID is missing in .env');

  // Get the parent page details
  const page = await notion.pages.retrieve({ page_id: parentId });
  
  // Get page title
  const titleProp = page.properties?.title?.title?.[0]?.plain_text || 
                    page.properties?.Name?.title?.[0]?.plain_text ||
                    'Notion Page';
  
  // Fetch blocks (children) of the parent page
  const blocksResponse = await notion.blocks.children.list({
    block_id: parentId,
    page_size: 20,
  });

  // Count different types
  const childPages = blocksResponse.results.filter(b => b.type === 'child_page').length;
  const paragraphs = blocksResponse.results.filter(b => b.type === 'paragraph').length;
  const headings = blocksResponse.results.filter(b => 
    b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3'
  ).length;

  // Extract text content from blocks
  const textContent = blocksResponse.results
    .filter(b => b.type === 'paragraph' && b.paragraph?.rich_text?.length > 0)
    .map(b => b.paragraph.rich_text.map(t => t.plain_text).join(''))
    .join('\n\n');

  return {
    pageId: parentId,
    title: titleProp,
    lastEdited: page.last_edited_time,
    stats: {
      totalBlocks: blocksResponse.results.length,
      childPages,
      paragraphs,
      headings,
    },
    textContent: textContent || 'No text content in this page.',
    url: page.url,
  };
};


// Create a new page
const createPage = async (title, content = []) => {
  if (!process.env.NOTION_KEY) throw new Error('NOTION_KEY is missing');
  const parentId = process.env.NOTION_PAGE_ID;
  if (!parentId) throw new Error('NOTION_PAGE_ID is missing in .env');

  const blocks = content.map(text => ({
    object: 'block',
    paragraph: {
      rich_text: [{ text: { content: text } }],
    },
  }));

  const response = await notion.pages.create({
    parent: { page_id: parentId }, 
    properties: {
      title: {
        title: [{ text: { content: title } }],
      },
    },
    children: blocks,
  });
  return response;
};

// Search pages
const searchPages = async (query) => {
  if (!process.env.NOTION_KEY) throw new Error('NOTION_KEY is missing');
  
  const response = await notion.search({
    query: query,
    filter: {
      value: 'page',
      property: 'object',
    },
    sort: {
      direction: 'descending',
      timestamp: 'last_edited_time',
    },
    page_size: 5,
  });
  
  return response.results.map(page => {
    const title = page.properties?.title?.title?.[0]?.plain_text || 
                  page.properties?.Name?.title?.[0]?.plain_text || 
                  'Untitled';
    return {
      id: page.id,
      title: title,
      url: page.url,
      lastEdited: page.last_edited_time,
    };
  });
};


// Append content to an existing page (as blocks)
const appendToPage = async (pageId, content = []) => {
  if (!process.env.NOTION_KEY) throw new Error('NOTION_KEY is missing');
  
  // Use env default if pageId is not provided
  const targetId = pageId || process.env.NOTION_PAGE_ID;
  if (!targetId) throw new Error('Target Page ID is missing (argument or env)');

  const blocks = content.map(text => ({
    object: 'block',
    paragraph: {
      rich_text: [{ text: { content: text } }],
    },
  }));

  const response = await notion.blocks.children.append({
    block_id: targetId,
    children: blocks,
  });
  return response;
};

module.exports = { createTestPage, getPages, createPage, searchPages, appendToPage };
