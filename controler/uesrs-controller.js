const enumRole = require('../models/enumRole');
const Users = require('../models/users');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const users = await Users.find({ role: enumRole.user });
        res.send(users);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const getSelectUser = async (req, res) => {
    try {
        const selectedUser = await Users.findById(req.params._id);
        res.send(selectedUser);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const createUsers = async (req, res) => {
    const userData = req.body;
    const fieldsToSave = {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: await bcrypt.hash(userData.password, 10),
        role: enumRole.user
    }
    if (userData.name !== userData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (userData.name.length < 3 || userData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(userData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (userData.username !== userData.username.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in username' })
    }
    else if (userData.username.length < 5 || userData.username.length > 20) {
        res.status(400).send({ message: 'Username must be 5-20 character long' })
    }
    else if (userData.password.length < 6 || userData.password.length > 20) {
        res.status(400).send({ message: 'Password must be 6-20 character long' })
    }
    else if (userData.password !== userData.password.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in password' })
    }
    else {
        const users = new Users(fieldsToSave)
        try {
            await users.save();
            res.status(200).send(users);
        } catch (err) {
            res.status(400).send({ message: "This email is already exist!" });
        }
    }
}

const updateUsers = async (req, res) => {
    const updateUsersData = req.body;
    const fieldsToSave = {
        name: updateUsersData.name,
        email: updateUsersData.email,
        username: updateUsersData.username,
        role: enumRole.user
    }
    if (updateUsersData.name !== updateUsersData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (updateUsersData.name.length < 3 || updateUsersData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(updateUsersData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (updateUsersData.username !== updateUsersData.username.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in username' })
    }
    else if (updateUsersData.username.length < 5 || updateUsersData.username.length > 20) {
        res.status(400).send({ message: 'Username must be 5-20 character long' })
    }
    else {
        try {
            const users = await Users.findByIdAndUpdate(req.params._id, { $set: fieldsToSave });
            if (!users) {
                return res.status(404).send({ error: 'User not found' });
            }
            res.send(users);
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    }
}

const deleteUsers = async (req, res) => {
    try {
        const users = await Users.findByIdAndDelete(req.params._id);
        if (!users) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({ message: 'User deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getUsers, getSelectUser, createUsers, updateUsers, deleteUsers };