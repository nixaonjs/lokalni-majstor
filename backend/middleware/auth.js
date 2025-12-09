const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Morate biti prijavljeni da pristupite ovoj stranici." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Ovaj nalog ne postoji." });
        }

        const userId = decoded.id ?? decoded.user_id ?? decoded.userId;

        if (!userId) {
            console.error("JWT decoded payload nema user id:", decoded);
            return res.status(403).json({ message: "Nevazeci token (nema user id):" });
        }

        req.user = { id:
            decoded.id || decoded.userId
        };

        next();
    });
};

module.exports = verifyToken;