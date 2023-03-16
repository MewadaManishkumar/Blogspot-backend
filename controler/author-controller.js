const Users = require('../models/users')
const enumRole = require('../models/enumRole');

const getAuthor = async (req, res) => {
    const authors = await Users.find({role: enumRole.author});
    res.send(authors);
}

const createAuthor = async (req, res) => {  
    const authorData = req.body;
    const fieldsToSave = {
        name: authorData.name,
        email: authorData.email,
        username: authorData.username,
        password: authorData.password,
        role: enumRole.author
    }
    const author = new Users(fieldsToSave);
    try {
        await author.save();
        res.send(author);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateAuthor = async (req, res) => {
    try {
        const author = await Users.findByIdAndUpdate(req.params._id,{$set: req.body});
        if (!author) {
            return res.status(404).send({ error: 'Author not found' });
        }
        res.send(author);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const deleteAuthor = async (req, res) => {
    try {
        const author = await Users.findByIdAndDelete(req.params._id);
        if (!author) {
            return res.status(404).send({ error: 'Author not found' });
        }
        res.send({ message: 'Author deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = {getAuthor,createAuthor,updateAuthor,deleteAuthor};