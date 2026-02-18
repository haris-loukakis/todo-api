const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/auth/login', login);
router.get('/auth/logout', logout);

module.exports = router;