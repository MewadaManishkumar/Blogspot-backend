const {getUsers,createUsers,updateUsers,deleteUsers} = require("../controler/uesrs-controller")
const {getAdmin,createAdmin,updateAdmin,deleteAdmin} = require("../controler/admin-controller")
const {getAuthor,createAuthor,updateAuthor,deleteAuthor} = require("../controler/author-controller")
const {getBlog,createBlog,updateBlog,deleteBlog,getSelectBlog} = require('../controler/blog-controller')
const {getCategory, createCategory, updateCategory, deleteCategory} = require('../controler/category-controller')
const signupUser = require('../controler/singup-controller');

const express = require('express');
const router = express.Router();

//Admin API
router.get("/admins/list",getAdmin);
router.post("/admins/create", createAdmin);
router.put("/admins/update/:_id", updateAdmin);
router.delete("/admins/delete/:_id", deleteAdmin);

//Users API
router.get("/users/list",getUsers);
router.post("/users/create", createUsers);
router.put("/users/update/:_id", updateUsers);
router.delete("/users/delete/:_id", deleteUsers);

//Author API
router.get("/authors/list",getAuthor);
router.post("/authors/create", createAuthor);
router.put("/authors/update/:_id", updateAuthor);
router.delete("/authors/delete/:_id", deleteAuthor);

//Category API
router.get("/categories/list",getCategory);
router.post("/categories/create", createCategory);
router.put("/categories/update/:_id", updateCategory);
router.delete("/categories/delete/:_id", deleteCategory);

//Blog API
router.get("/blogs/list",getBlog);
router.get("/blogs/list/:_id",getSelectBlog);
router.post("/blogs/create", createBlog);
router.put("/blogs/update/:_id", updateBlog);
router.delete("/blogs/delete/:_id", deleteBlog);

//Singup API
router.post("/signup",signupUser);



module.exports= router;

