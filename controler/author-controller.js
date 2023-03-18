const Users = require('../models/users')
const enumRole = require('../models/enumRole');

const getAuthor = async (req, res) => {
    try {
        const authors = await Users.find({ role: enumRole.author });
        res.send(authors);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const getSelectAuthor = async (req, res) => {
    try {
        const selectedAuthor = await Users.findById(req.params._id);
        res.send(selectedAuthor);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const createAuthor = async (req, res) => {
    const authorData = req.body;
    const fieldsToSave = {
        name: authorData.authorname,
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
    const updateAuthorData = req.body;
    const fieldsToSave = {
        name: updateAuthorData.authorname,
        email: updateAuthorData.email,
        username: updateAuthorData.username,
        password: updateAuthorData.password,
        role: enumRole.author
    }
    try {
        const author = await Users.findByIdAndUpdate(req.params._id, { $set: fieldsToSave });
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

module.exports = { getAuthor, getSelectAuthor, createAuthor, updateAuthor, deleteAuthor };