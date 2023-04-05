const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Users = require('../models/users')
const Category = require('../models/category')
const Blog = require('../models/blog');

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
        category_id: blogData.category,
    }
    if (req.file?.filename) {
        fieldsToSave.avatar = req.file.filename;
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
    const selectedBlog = await Blog.findById(req.params._id);

    let deleteFilePath = null;
    if (req.file && selectedBlog.avatar !== req.file.filename) {
        deleteFilePath = path.resolve(__dirname, '..', `uploads/avatars/${selectedBlog.avatar}`);
    }

    const updateBlogdata = req.body;
    const fieldsToSave = {
        title: updateBlogdata.title,
        content: updateBlogdata.content,
        user_id: updateBlogdata.user,
        category_id: updateBlogdata.category
    }

    if (req.file) {
        fieldsToSave.avatar = req.file.filename;
    }

    try {
        if (deleteFilePath) {
            fs.unlink(deleteFilePath, (err) => {
                if (err) throw err;
                else {
                    console.log(`previous file was deleted`);
                }
            })
        }

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
    const selectedBlog = await Blog.findById(req.params._id);

    let filePath = null;
    if (selectedBlog.avatar) {
        filePath = path.resolve(__dirname, '..', `uploads/avatars/${selectedBlog.avatar}`);
    }
    try {
        if (filePath) {
            fs.unlink(filePath, (err) => {
                if (err) throw err;
                else {
                    console.log(`file was deleted`);
                }
            })
        }

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