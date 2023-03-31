const express = require('express');
const protect = require('../middleware/authmiddleware')
const chatRoute = require('../controllers/chatController');
const router = express.Router();
router.post('/', protect.protect, chatRoute.accessChat);
router.get('/fetchChats', protect.protect, chatRoute.fetchChat);
router.post('/group', protect.protect, chatRoute.createGroupChat);
router.put('/rename', protect.protect, chatRoute.renameGroup);
router.put('/groupremove', protect.protect, chatRoute.deleteFromGroup);
router.put('/groupadd', protect.protect, chatRoute.addToGroup);
module.exports = router;
