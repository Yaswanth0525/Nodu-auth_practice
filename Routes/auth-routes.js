const express = require('express');
const {loginUser , registerUser,changePassword} = require('../controllers/auth-controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middle');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password',authMiddleware ,changePassword);










module.exports = router;