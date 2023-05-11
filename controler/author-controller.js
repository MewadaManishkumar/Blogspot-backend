const Users = require('../models/users')
const enumRole = require('../models/enumRole');
const bcrypt = require('bcrypt');

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
        name: authorData.name,
        email: authorData.email,
        username: authorData.username,
        password: await bcrypt.hash(authorData.password, 10),
        role: enumRole.author
    }
    if (authorData.name !== authorData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (authorData.name.length < 3 || authorData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(authorData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (authorData.username !== authorData.username.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in username' })
    }
    else if (authorData.username.length < 5 || authorData.username.length > 20) {
        res.status(400).send({ message: 'Username must be 5-20 character long' })
    }
    else if (authorData.password.length < 6 || authorData.password.length > 20) {
        res.status(400).send({ message: 'Password must be 6-20 character long' })
    }
    else if (authorData.password !== authorData.password.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in password' })
    } else {
        const author = new Users(fieldsToSave);
        try {
            await author.save();
            res.send(author);
        } catch (err) {
            res.status(400).send({ message: "This email is already exist!" });
        }
    }
}

const updateAuthor = async (req, res) => {
    const updateAuthorData = req.body;
    const fieldsToSave = {
        name: updateAuthorData.name,
        email: updateAuthorData.email,
        username: updateAuthorData.username,
        role: enumRole.author
    }
    if (updateAuthorData.name !== updateAuthorData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (updateAuthorData.name.length < 3 || updateAuthorData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(updateAuthorData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (updateAuthorData.username !== updateAuthorData.username.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in username' })
    }
    else if (updateAuthorData.username.length < 5 || updateAuthorData.username.length > 20) {
        res.status(400).send({ message: 'Username must be 5-20 character long' })
    } else {
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
}

const deleteAuthor = async (req, res) => {
    try {
        const access = req.params.isDeleted;
        let updateObj = {}
        if (access === 'false') {
            updateObj.isDeleted = true;
        }
        else if (access === 'true') {
            updateObj.isDeleted = false;
        }
        const author = await Users.findByIdAndUpdate(req.params._id, updateObj);

        if (!author) {
            return res.status(404).send({ error: 'Author not found' });
        }
        res.send(author);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getAuthor, getSelectAuthor, createAuthor, updateAuthor, deleteAuthor };