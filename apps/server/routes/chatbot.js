const router = require('express').Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/message', chatbotController.sendMessage);


router.get('/quick-actions', chatbotController.getQuickActions);
router.get('/conversations/:conversationId', chatbotController.getConversationHistory);
router.delete('/conversations/:conversationId', chatbotController.clearConversation);

module.exports = router;