const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const pool = require('../models/db');
const verifyToken = require('../middleware/auth');
const transporter = require('../utils/mailer');


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const exists = await pool.query(
        'SELECT 1 FROM users WHERE email = $1',
        [email]
    );
    if (exists.rows.length > 0) {
        return res
        .status(400)
        .json({ message: 'Ovaj email je vec u upotrebi.'});
    }

    const hashed = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashed, false]
        );

        const newUser = result.rows[0];

        const verifyToken = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: 'id' }
        );

        const verifyURL = '${process.env.BASE_URL}/api/auth/verify-mail?token=${verifyToken}';
        await transporter.sendMail ({
            from: `"Lokalni Majstor" <${process.env.MAILTRAP_USER}>`,
            to: newUser.email,
            subject: 'Potvrdite svoj email',
            html: '<p>Kliknite <a href="${verifyUrl}">ovdje</a> da potvrdite email.</p>',
        });

        res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res
        .status(400)
        .json({ message: 'Ovaj email je vec u upotrebi.'});
      }
      return res.status(500).json({ message: 'Greska na serveru.'});
    }
});

router.post('/login', authController.login);

router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [req.user.id]
    );
    const fullUser = result.rows[0];
    return res.json(fullUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Greška na serveru.' });
  }
});

router.get('/verify-email', authController.verifyEmail);

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Nema tokena" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userid = payload.id;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userid]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});


module.exports = router;