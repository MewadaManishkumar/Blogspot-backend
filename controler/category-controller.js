const Category = require('../models/category');
const Blog = require('../models/blog')

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const getSelectCategory = async (req, res) => {
    try {
        const selectedCategory = await Category.findById(req.params._id);
        res.send(selectedCategory);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const createCategory = async (req, res) => {
    const categoryData = req.body;
    const fielsToSave = {
        name: categoryData.category
    }
    const category = new Category(fielsToSave);
    try {
        await category.save();
        res.send(category);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateCategory = async (req, res) => {
    const updateCategoryData = req.body;
    const fielsToSave = {
        name: updateCategoryData.category
    }
    try {
        const category = await Category.findByIdAndUpdate(req.params._id, { $set: fielsToSave });
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
        const blogCount = await Blog.countDocuments({ category_id: req.params._id })
        if (blogCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category as it is associated with one or more blogs.' });
        } else {
            const category = await Category.findByIdAndDelete(req.params._id);
            if (!category) {
                return res.status(404).send({ error: 'Category not found' });
            }
            res.send({ message: 'Category deleted' });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getCategory, getSelectCategory, createCategory, updateCategory, deleteCategory }