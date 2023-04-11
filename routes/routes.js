const express = require('express');
const router = express.Router();

// import multer and the AvatarStorage engine
const _ = require('lodash');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

//helpers
const upload = require('../helpers/UploadLimits')

//Controllers
const { getUsers, getSelectUser, createUsers, updateUsers, deleteUsers } = require("../controler/uesrs-controller")
const { getAdmin, getSelectAdmin, createAdmin, updateAdmin, deleteAdmin } = require("../controler/admin-controller")
const { getAuthor, getSelectAuthor, createAuthor, updateAuthor, deleteAuthor } = require("../controler/author-controller")
const { getBlog, createBlog, updateBlog, deleteBlog, getSelectBlog } = require('../controler/blog-controller')
const { getCategory, getSelectCategory, createCategory, updateCategory, deleteCategory } = require('../controler/category-controller')
const { loginUser, logoutUser } = require('../controler/login-controller');
const { authenticateToken, createNewToken } = require('../controler/jwt-controller');

//Admin API
router.get("/admins/list", getAdmin);
router.get("/admins/list/:_id", getSelectAdmin);
router.post("/admins/create", createAdmin);
router.put("/admins/update/:_id", updateAdmin);
router.delete("/admins/delete/:_id", deleteAdmin);

//Users API
router.get("/users/list", getUsers);
router.get("/users/list/:_id", getSelectUser);
router.post("/users/create", createUsers);
router.put("/users/update/:_id", updateUsers);
router.delete("/users/delete/:_id", deleteUsers);

//Author API
router.get("/authors/list", getAuthor);
router.get("/authors/list/:_id", getSelectAuthor);
router.post("/authors/create", createAuthor);
router.put("/authors/update/:_id", updateAuthor);
router.delete("/authors/delete/:_id", deleteAuthor);

//Category API
router.get("/categories/list", getCategory);
router.get("/categories/list/:_id", getSelectCategory);
router.post("/categories/create", createCategory);
router.put("/categories/update/:_id", updateCategory);
router.delete("/categories/delete/:_id", deleteCategory);

//Blog API
router.get("/blogs/list", getBlog);
router.get("/blogs/list/:_id", getSelectBlog);
router.post("/blogs/create",upload.single('avatar'),createBlog);
router.put("/blogs/update/:_id",upload.single('avatar'), updateBlog);
router.delete("/blogs/delete/:_id/:role",deleteBlog);

//Login API
router.post("/login", loginUser);
router.post('/logout', logoutUser);

router.post('/token', createNewToken);

module.exports = router;