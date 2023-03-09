// import bcrypt from 'bcrypt';

const User = require('../models/users');

const signupUser = async (req, res) => {

    try {
        const hashedPassword = await hash(request.body.password, 10);
        const user = {
            name: req.body.name, username: req.body.username, email: req.body.email, password: hashedPassword,
            role: req.body.role
        }

        const newUser = new User(user);
        await newUser.save();
        res.send(newUser);
        if (!newUser) {
            return res.status(404).send({ error: 'Author not found' });
        }
        return res.status(200).send({ message: 'Signup Successful' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

// const loginUser = async (req, res) => {
//     let user = await User.findOne({ username: request.body.username });
//     if (!user) {
//         return response.status(400).json({ msg: 'Username not find' });
//     }

//     try {
//         let match = await bcrypt.compare(request.body.password, user.password);
//         if (match) {
//             const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
//             const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);

//             const newToken = new Token({ token: refreshToken });
//             await newToken.save();

//             response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });

//         } else {
//             response.status(400).json({ msg: 'Password does not match' })
//         }
//     } catch (error) {
//         response.status(500).json({ msg: 'error while login the user' })
//     }
// }

// const logoutUser = async (request, response) => {
//     const token = request.body.token;
//     await Token.deleteOne({ token: token });

//     response.status(204).json({ msg: 'logout successfull' });
// }

module.exports = signupUser;