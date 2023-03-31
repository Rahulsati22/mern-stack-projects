const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authmiddleware");
const registerUser = require('../controllers/userController')
router.post('/registration', registerUser.registerUser);
router.post('/login', registerUser.authUser)
router.get('/users', protect, registerUser.allUsers);
module.exports = router;