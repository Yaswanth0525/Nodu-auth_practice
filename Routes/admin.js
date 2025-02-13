const express = require('express');
const router = express.Router();
const authMiddleware =require('../middleware/auth-middle')
const isAdmin = require('../middleware/admin-middleware')

router.get('/welcome',authMiddleware,isAdmin,(req , res) =>{
    res.json({
        message: 'Welcome to the admin page',
    })
})

module.exports = router;