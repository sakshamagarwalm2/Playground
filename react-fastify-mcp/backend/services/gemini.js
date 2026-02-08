
const { GoogleGenerativeAI } = require('@google/generative-ai');

const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};


const chatWithGeminiStream = async function* (message, history = [], tools = {}) {
  const genAI = initGemini();
  
  // Convert MCP tool definitions to Gemini function declarations
  const toolDefinitions = Object.values(tools).flatMap(mcp => mcp.toolDefinitions || []);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    tools: toolDefinitions.length > 0 ? [{ functionDeclarations: toolDefinitions }] : undefined,
    systemInstruction: "You are a helpful assistant. You have access to tools for Email, Calendar, and Notion. Use them when requested."
  });

  const chat = model.startChat({
    history: history,
  });

  try {
    yield { type: 'log', message: 'Analyzing request...' };
    let result = await chat.sendMessage(message);
    let response = result.response;
    let text = response.text();

    let functionCalls = response.functionCalls();
    
    // Simple loop to handle up to 5 turns of tool use
    let turns = 0;
    const MAX_TURNS = 5;

    while (functionCalls && functionCalls.length > 0 && turns < MAX_TURNS) {
      turns++;
      yield { type: 'log', message: `Thinking... (Turn ${turns})` };
      console.log(`[Gemini] Processing ${functionCalls.length} function calls...`);
      
      const functionResponses = [];

      for (const call of functionCalls) {
        const { name, args } = call;
        console.log(`[Gemini] Calling tool: ${name}`, args);
        yield { type: 'log', message: `Calling tool: ${name}` }; // Feedback to user

        let toolResult;
        let toolFound = false;

        // Find the tool implementation across all MCP modules
        for (const mcpName in tools) {
            const mcp = tools[mcpName];
            
            // Optimization: Check if this MCP module actually defines this tool
            const definesTool = mcp.toolDefinitions?.some(def => def.name === name);
            if (!definesTool) continue;

            if (mcp.executeImpl && typeof mcp.executeImpl === 'function') {
                try {
                    const res = await mcp.executeImpl(name, args);
                    if (res !== undefined && res !== null) {
                        toolResult = res;
                        toolFound = true;
                        break;
                    }
                } catch (err) {
                    console.error(`Error executing ${name} in ${mcpName}:`, err);
                    toolResult = { error: err.message };
                    toolFound = true; // Handled with error
                    break;
                }
            }
        }

        if (!toolFound) {
            toolResult = { error: `Tool ${name} not found.` };
        }

        yield { type: 'log', message: `Executed ${name}.` }; // Feedback to user

        functionResponses.push({
            functionResponse: {
                name: name,
                response: { result: toolResult } 
            }
        });
      }

      // Send function responses back to the model
      yield { type: 'log', message: 'Processing tool results...' };
      result = await chat.sendMessage(functionResponses);
      response = result.response;
      text = response.text(); 
      functionCalls = response.functionCalls();
    }

    yield { type: 'result', content: text }; // Final result

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    yield { type: 'error', message: error.message };
    throw error; 
  }
};

module.exports = {
  chatWithGemini: async (message, history, tools) => {
      // Backwards compatibility wrapper if needed, or just warn.
      // For now, we will just drain the stream and return the text.
      const generator = chatWithGeminiStream(message, history, tools);
      let finalText = '';
      for await (const chunk of generator) {
          if (chunk.type === 'result') finalText = chunk.content;
      }
      return finalText;
  },
  chatWithGeminiStream
};
