const enumRole = require('../models/enumRole');
const Users = require('../models/users');

const getUsers = async (req, res) => {
    try{
        const users = await Users.find({role: enumRole.user});
        res.send(users);
    } catch(err){
        res.status(400).send({ error: err.message });
    }
    
}

const createUsers = async (req, res) => {
    const userData = req.body;
    const fieldsToSave = {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        role: enumRole.user
    }
    const users = new Users(fieldsToSave)
    try {
        await users.save();
        res.send(users);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateUsers = async (req, res) => {
    try {
        const users = await Users.findByIdAndUpdate(req.params._id,{$set: req.body});
        if (!users) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(users);
    } catch (err) {
        res.status(400).send({ error: err.message });
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

module.exports = {getUsers,createUsers,updateUsers,deleteUsers};