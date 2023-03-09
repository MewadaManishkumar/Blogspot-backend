const {getAdmin,createAdmin,updateAdmin,deleteAdmin} = require('../controler/admin-controller');
const {getAuthor,createAuthor,updateAuthor,deleteAuthor} = require('../controler/author-controller')
const {getBlog,createBlog,updateBlog,deleteBlog} = require('../controler/blog-controller')
const {getCategory, createCategory, updateCategory, deleteCategory} = require('../controler/category-controller')
const signupUser = require('../controler/user-controller');

const express = require('express');
const router = express.Router();

//Admin API 
router.get("/admins/list",getAdmin);
router.post("/admins/create", createAdmin);
router.put("/admins/update/:_id", updateAdmin);
router.delete("/admins/delete/:_id", deleteAdmin);

//Author API
router.get("/authors/list",getAuthor);
router.post("/authors/create",createAuthor);
router.put("/authors/update/:_id", updateAuthor);
router.delete("/authors/delete/:_id", deleteAuthor);

//Category API
router.get("/categories/list",getCategory);
router.post("/categories/create", createCategory);
router.put("/categories/update/:_id", updateCategory);
router.delete("/categories/delete/:_id", deleteCategory);

//Blog API
router.get("/blogs/list",getBlog);
router.post("/blogs/create", createBlog);
router.put("/blogs/update/:_id", updateBlog);
router.delete("/blogs/delete/:_id", deleteBlog);

//Users API
router.post("/signup",signupUser);



module.exports= router;

