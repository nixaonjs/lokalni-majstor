const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/me', verifyToken, (req, res) =>{
    res.json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    });
});

const userRoutes = require('./routes/auth');
app.use('/api/users', userRoutes);

module.exports = router;