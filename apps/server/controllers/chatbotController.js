const AIBotService = require('../services/aibotService');
const conversations = new Map();

const handleResponse = (res, success, data, status = 200) => res.status(status).json({ success, ...data });

exports.sendMessage = async (req, res) => {
  const { message, conversationId, userId } = req.body;
  if (!message?.trim()) return handleResponse(res, false, { message: 'Empty message' }, 400);

  const convId = conversationId || `conv_${Date.now()}`;
  const history = conversations.get(convId) || [];

  try {
    const result = await AIBotService.chat(message, history);
    const updatedHistory = [...history, { role: 'user', content: message }, { role: 'assistant', content: result.response }].slice(-20);
    
    conversations.set(convId, updatedHistory);
    return handleResponse(res, true, { data: { ...result, conversationId: convId } });
  } catch (error) {
    return handleResponse(res, false, { message: error.message }, 500);
  }
};

exports.getQuickActions = async (req, res) => {
  const actions = await AIBotService.getQuickActions();
  return handleResponse(res, true, { data: actions });
};

exports.clearConversation = (req, res) => {
  conversations.delete(req.params.conversationId);
  return handleResponse(res, true, { message: 'Cleared' });
};

exports.exportConversation = (req, res) => {
  const history = conversations.get(req.params.conversationId);
  if (!history) return handleResponse(res, false, { message: 'Not found' }, 404);
  
  if (req.query.format === 'text') {
    res.setHeader('Content-Type', 'text/plain');
    return res.send(history.map(m => `[${m.role}]: ${m.content}`).join('\n\n'));
  }
  return handleResponse(res, true, { data: history });
};

exports.getConversationHistory = (req, res) => {
  const history = conversations.get(req.params.conversationId);

  if (!history) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: history
  });
};
