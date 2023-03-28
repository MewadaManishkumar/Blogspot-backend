const mongoose = require("mongoose");
const Users = require('../models/users');
const Category = require('../models/category');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    category_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
});

module.exports = mongoose.model("Blog", blogSchema);

