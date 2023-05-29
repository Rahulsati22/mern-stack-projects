const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuth } = require('../middleware/auth');
router.route('/').post(isAuth, messageController.sendMessage);
router.route('/allmessage/:id').get(isAuth, messageController.allMessages);
module.exports = router;