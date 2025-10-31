const { authSecret, refreshSecret } = require("../config");
const jwt = require('jsonwebtoken');

const validateBody = (schema) => (req, res, next) => {
    if (!req.body)
        return res.status(400).json({ message: "Bad Request" });

    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).json({
            message: error.details[0].message
        })
    next();
}

const validateAuth = () => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Expecting format "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const { id } = jwt.verify(token, authSecret);
        req.userId = id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const validateRefreshToken = () => (req, res, next) => {
    const refHeader = req.headers['refresh'];
    if (!refHeader) {
        return res.status(401).json({ message: 'Refresh header missing' });
    }

    const token = refHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const { id } = jwt.verify(token, refreshSecret);
        req.userId = id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { validateBody, validateAuth, validateRefreshToken }
