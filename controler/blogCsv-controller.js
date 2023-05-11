const Category = require("../models/category");
const User = require("../models/users");
const csv = require('csv-parser')
const fs = require("fs");
const path = require("path");
const Blog = require("../models/blog");

const bloguploadCsv = async (req, res) => {
  try {
    let dataParsed = await parseCSV(req.file.filename);
    let parsingArr = [];
    let categoryData = await Category.find({})
    for (let i = 0; i < dataParsed.length; i++) {
      let arrData = dataParsed[i];
      let dataToSave = {
        title: arrData.title,
        content: arrData.content,
        user_id: arrData.user,
        category_id: arrData.category
      };

      try {
        if (!dataToSave.title || !dataToSave.content || !dataToSave.user_id || !dataToSave.category_id) {
          dataToSave.err_msg = 'One or more field is blank';
          dataToSave.is_error = true;
          dataToSave.userName = dataToSave.user_id
          dataToSave.categoryName = dataToSave.category_id.split("|")
        } else {
          let emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          if (!emailValidate.test(dataToSave.user_id)) {
            dataToSave.err_msg = 'Email format is invalid!';
            dataToSave.is_error = true;
            dataToSave.userName = dataToSave.user_id
            dataToSave.categoryName = dataToSave.category_id.replace("|", ",")
            parsingArr.push(dataToSave);
          }
          else {
            let userData = await User.findOne({ email: dataToSave.user_id, role: "author" })
            if (!userData) {
              dataToSave.err_msg = 'Author is not Found';
              dataToSave.is_error = true;
              dataToSave.userName = dataToSave.user_id
              dataToSave.categoryName = dataToSave.category_id.replace("|", ",")
              parsingArr.push(dataToSave);
            } else {
              dataToSave.user_id = userData._id;
              dataToSave.userName = userData.email

              let categoryArr = dataToSave.category_id.split('|')
              let categoryPascal = categoryArr.map((category) => category.replace(/\w\S*/g, name => name.charAt(0).toUpperCase() + name.substr(1).toLowerCase()))

              let categories = categoryData.filter(category => categoryPascal.includes(category.name));
              if (categories.length !== categoryPascal.length) {
                const missingCategories = categoryPascal.filter(name => !categories.some(category => category.name === name));
                for (const name of missingCategories) {
                  let newCategory = await Category.create({ name })
                  categories.push(newCategory)
                  categoryData.push(newCategory)
                }
              }
              dataToSave.category_id = categories.map(category => category._id);
              Blog.create(dataToSave);
              dataToSave.err_msg = '';
              dataToSave.is_error = false;
              dataToSave.categoryName = categories.map(category => category.name).join(",")
              parsingArr.push(dataToSave);
            }
          }
        }
      } catch (err) {
        dataToSave.err_msg = 'Something went wrong!!';
        dataToSave.is_error = true;
        parsingArr.push(dataToSave);
      }
    }
    res.json({ msg: "Blogs successfully inserted!", data: parsingArr });
  } catch (err) {
    res.json({ msg: "Something went wrong!! Data not inserted!" });
  }
};

function parseCSV(CSV) {
  return new Promise((resolve, reject) => {
    let returnData = [];
    fs.createReadStream(path.resolve(__dirname, "../uploadcsv", CSV))
      .pipe(csv())
      .on("data", async (data) => {
        returnData.push({
          title: data.title,
          content: data.content,
          user: data.user,
          category: data.category
        })
      })
      .on("end", () => {
        resolve(returnData);
        try {
          fs.unlinkSync(path.resolve(__dirname, "../uploadcsv", CSV));
        } catch (err) {
          console.log(err);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = { bloguploadCsv };