const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../models/db');

// Login sistem
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Korisnik ne postoji' });
        }

        const user = userResult.rows[0];

        if (!user.is_verified) {
            return res
            .status(403)
            .json({ message: 'Molimo potvrdite email prije prijave.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Pogresna lozinka' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({
            message: 'Prijava uspjesna',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greska na serveru prilikom prijave' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
        await pool.query(
            'UPDATE users SET is_verified = TRUE WHERE id = $1',
            [userId]
        );
        return res.json({ message: 'Email je uspješno potvrđen!'});
    }   catch (err) {
        return res.status(400).json({ message: 'Neispravan ili je token istekao.'});
    }
};