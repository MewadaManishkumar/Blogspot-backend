const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const Token = require('../models/token');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ msg: 'token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ msg: 'invalid token' })
        }
        req.user = user;
        next();
    })
}

const createNewToken = async (req, res) => {
    const refreshToken = req.body.refreshToken.split(' ')[1];
    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token is missing' })
    }

    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
        return res.status(404).json({ msg: 'Refresh token is not valid' });
    }

    jwt.verify(token.token, process.env.REFRESH_SECRET_KEY, (error, user) => {
        if (error) {
            res.status(500).json({ msg: 'invalid refresh token' });
        }
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET_KEY, { expiresIn: "5m" });

        return res.status(200).json({ accessToken: accessToken })
    })
}

module.exports = { authenticateToken, createNewToken }