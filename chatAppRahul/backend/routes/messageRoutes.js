const express = require('express');
const router = express.Router();
const protect = require('../middleware/authmiddleware')
const messageController = require('../controllers/messageController')
router.post('/',protect.protect, messageController.sendMessage)
router.get('/:chatId', protect.protect, messageController.allMessages)
module.exports = router;