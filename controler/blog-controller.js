const Users = require('../models/users')
const Category = require('../models/category')
const Blog = require('../models/blog')

const getBlog = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("user_id").populate("category_id");
        res.send(blogs);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}
const getSelectBlog = async (req, res) => {
    try {
        const selectedBlog = await Blog.findById(req.params._id);
        res.send(selectedBlog)
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const createBlog = async (req, res) => {
    const blogData = req.body;
    const fieldsToSave = {
        title: blogData.title,
        content: blogData.content,
        user_id: blogData.user,
        category_id: blogData.category
    }
    const blog = new Blog(fieldsToSave);
    try {
        await blog.save();
        res.send(blog);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateBlog = async (req, res) => {
    const updateBlogdata = req.body;
    const fieldsToSave = {
        title: updateBlogdata.title,
        content: updateBlogdata.content,
        user_id: updateBlogdata.user,
        category_id: updateBlogdata.category
    }
    try {
        const blog = await Blog.findByIdAndUpdate(req.params._id, { $set: fieldsToSave });
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }
        res.send(blog);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params._id);
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }
        res.send({ message: 'Blog deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getBlog, getSelectBlog, createBlog, updateBlog, deleteBlog }