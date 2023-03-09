const Category = require('../models/category');

const getCategory = async (req, res) => {
    const categories = await Category.find();
    res.send(categories);
}

const createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        await category.save();
        res.send(category);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params._id, {$set: req.body});
        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }
        res.send(category);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params._id);
        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }
        res.send({ message: 'Category deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = {getCategory, createCategory, updateCategory, deleteCategory}