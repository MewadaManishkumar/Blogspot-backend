const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const User = require('../models/users')
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
const getBlogForAuthor = async (req, res) => {
    try {
        const blogs = await Blog.find({ user_id: req.params.user_id }).populate("user_id").populate("category_id");
        res.send(blogs);
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
}
const getSelectBlog = async (req, res) => {
    try {
        const selectedBlog = await Blog.findById(req.params._id).populate("user_id")
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
    const selectedBlog = await Blog.findById(req.params._id)

    //create deleteFilePath
    let deleteFilePath = null;
    if (req?.file && selectedBlog?.avatar) {
        deleteFilePath = path.resolve(__dirname, '..', `uploads/avatars/${selectedBlog.avatar}`);
    }

    const updateBlogdata = req?.body;
    const fieldsToSave = {
        title: updateBlogdata?.title,
        content: updateBlogdata?.content,
        user_id: updateBlogdata?.user,
        category_id: updateBlogdata?.category
    }
    if (req?.file) {
        fieldsToSave.avatar = req?.file?.filename;
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
        console.log(err)
        res.status(400).send({ error: err.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const selectedBlog = await Blog.findById(req.params._id);
        const userRole = req.params.role;

        if (userRole === 'author' || userRole === 'user') {
            return res.status(401).send({ message: "You are not authorized to delete blog" });
        }

        let filePath = null;
        if (selectedBlog.avatar) {
            filePath = path.resolve(__dirname, '..', `uploads/avatars/${selectedBlog.avatar}`);
        }

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

module.exports = { getBlog, getBlogForAuthor, getSelectBlog, createBlog, updateBlog, deleteBlog }