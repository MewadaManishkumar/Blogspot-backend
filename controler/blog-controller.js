const Blog = require('../models/blog')
const Author = require('../models/author')
const Category = require('../models/category')

const getBlog = async (req, res) => {
    const blogs = await Blog.find().populate('author_id').populate('category_id');
    res.send(blogs);
}

const createBlog = async (req, res) => {
    const blog = new Blog(req.body);
    try {
        await blog.save();
        res.send(blog);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params._id, {$set: req.body});
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

module.exports = {getBlog,createBlog,updateBlog,deleteBlog}