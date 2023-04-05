const bcrypt = require('bcrypt');
const User = require('../models/users');
const Token = require('../models/token')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const loginUser = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'email does not match' });
    }
    try {
        let match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_SECRET_KEY, { expiresIn: 300 });
            const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET_KEY);

            const newToken = new Token({ token: refreshToken });
            await newToken.save();

            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, email: user.email, role: user.role });

        } else {
            res.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        res.status(500).json({ msg: 'error while login the user' })
    }
}

const logoutUser = async (req, res) => {
    const token = req.body.token;
    await Token.deleteOne({ token: token });
    
    res.status(204).json({ msg: 'logout successfull' });
}
module.exports = {loginUser, logoutUser};