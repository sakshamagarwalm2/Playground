
// test/dry_run.js
const path = require('path');
// specific to how we are running it
require(path.join(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

try {
  console.log('Testing imports...');
  
  const geminiService = require('../backend/services/gemini');
  console.log('✅ Gemini Service imported');
  
  const emailMcp = require('../backend/mcp/email');
  console.log('✅ Email MCP imported');
  
  const calendarMcp = require('../backend/mcp/calendar');
  console.log('✅ Calendar MCP imported');
  
  const notionMcp = require('../backend/mcp/notion');
  console.log('✅ Notion MCP imported');
  
  const googleService = require('../backend/services/google');
  console.log('✅ Google Service imported');
  
  const notionService = require('../backend/services/notion');
  console.log('✅ Notion Service imported');

  console.log('All modules imported successfully. Syntax check passed.');
  process.exit(0);
} catch (error) {
  console.error('❌ Import failed:', error);
  process.exit(1);
}
