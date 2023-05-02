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
          parsingArr.push(dataToSave);
        } else {
          let userData = await User.findOne({ email: dataToSave.user_id, role: "author" })
          if (!userData) {
            dataToSave.err_msg = 'Author is not Found';
            dataToSave.is_error = true;
            parsingArr.push(dataToSave);
          } else {
            dataToSave.user_id = userData._id;
            let category = await Category.findOne({ name: dataToSave.category_id })
            if (!category) {
              dataToSave.err_msg = 'Category is not Found';
              dataToSave.is_error = true;
              parsingArr.push(dataToSave);
            } else {
              dataToSave.category_id = category._id;
              Blog.create(dataToSave)
              dataToSave.err_msg = '';
              dataToSave.is_error = false;
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

// let categoryIds = [];
          // let categories = dataToSave.category_id.split(",");
          // for (let j = 0; j < categories.length; j++) {
          //   let category = await Category.findOne({ name: categories[j] });
          //   if (category) {
          //     categoryIds.push(category._id);
          //   } else {
          //     dataToSave.err_msg = `Category ${categories[j]} not found in database`;
          //     dataToSave.is_error = true;
          //     parsingArr.push(dataToSave);
          //   }
          // }

// let categoryIds = [];
//         if (dataToSave.category_id) {
//           let categories = dataToSave.category_id.split(",");
//           for (let j = 0; j < categories.length; j++) {
//             let category = await Category.findOne({ name: categories[j] });
//             if (category) {
//               categoryIds.push(category._id);
//             } else {
//               dataToSave.err_msg = `Category ${categories[j]} not found in database`;
//               dataToSave.is_error = true;
//               parsingArr.push(dataToSave);
//             }
//           }
//         } else {
//           arrData.err_msg = "No category provided";
//           arrData.is_error = true;
//           parsingArr.push(dataToSave);
//         }

//       let userData = await User.findOne({ _id: dataToSave.user_id });
//       if (!userData) {
//         dataToSave.err_msg = `Author not found in database`;
//         dataToSave.is_error = true;
//         parsingArr.push(dataToSave);
//       } else {
//         dataToSave.user_id = userData._id
//         try {
//           if (!dataToSave.title || !dataToSave.content) {
//             dataToSave.err_msg = "Title or Content is blank";
//             dataToSave.is_error = true;
//             parsingArr.push(dataToSave);
//           } else {
//             Blog.create(dataToSave)
//             dataToSave.err_msg = "";
//             dataToSave.is_error = false;
//             parsingArr.push(dataToSave);
//           }
//         } catch (err) {
//           dataToSave.err_msg = "Something went wrong!!";
//           dataToSave.is_error = false;
//           parsingArr.push(dataToSave);
//         }
//       }