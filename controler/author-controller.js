const Author = require('../models/author')

const getAuthor = async (req, res) => {
    const authors = await Author.find();
    res.send(authors);
}

const createAuthor = async (req, res) => {
    const author = new Author(req.body);
    try {
        await author.save();
        res.send(author);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params._id,{$set: req.body});
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
        const author = await Author.findByIdAndDelete(req.params._id);
        if (!author) {
            return res.status(404).send({ error: 'Author not found' });
        }
        res.send({ message: 'Author deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = {getAuthor,createAuthor,updateAuthor,deleteAuthor};