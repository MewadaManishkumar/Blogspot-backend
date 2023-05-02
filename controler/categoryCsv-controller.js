const Category = require("../models/category");
const fs = require("fs");
const csv = require('csv-parser')
const path = require('path');

const categoryuploadCsv = async (req, res) => {
    try {
        let dataParsed = await parseCSV(req.file.filename)
        let parsingArr = [];
        for (let i = 0; i < dataParsed.length; i++) {
            let arrData = dataParsed[i];
            let dataToSave = {
                name: arrData.name,
            };
            try {
                if (!dataToSave.name || dataToSave.name.trim().length === 0) {
                    dataToSave.err_msg = 'Category field is blank';
                    dataToSave.is_error = true;
                    parsingArr.push(dataToSave);
                } else {
                    const toPascalCase = arrData.name.replace(/\w\S*/g, name => name.charAt(0).toUpperCase() + name.substr(1).toLowerCase());
                    dataToSave.name = toPascalCase.trim()

                    let checkingIfCategoryExiest = await Category.findOne({ name: dataToSave.name });
                    if (checkingIfCategoryExiest) {
                        dataToSave.err_msg = 'Category already in database';
                        dataToSave.is_error = true;
                        parsingArr.push(dataToSave);
                    } else {
                        Category.create(dataToSave)
                        dataToSave.err_msg = '';
                        dataToSave.is_error = false;
                        parsingArr.push(dataToSave);
                    }
                }
            } catch (err) {
                dataToSave.err_msg = 'Something went wrong!!';
                dataToSave.is_error = true;
                parsingArr.push(dataToSave);
            }
        }
        res.json({
            msg: 'Categories successfully inserted!',
            data: parsingArr
        })
    } catch (err) {
        res.json({ msg: 'Something went wrong!! Data not inserted!' })
    }
}

function parseCSV(CSV) {
    return new Promise((resolve, reject) => {
        let returnData = []
        fs.createReadStream(path.resolve(__dirname, '../uploadcsv', CSV))
            .pipe(csv())
            .on('data', async (data) => {
                returnData.push({
                    name: data.name,
                });
            })
            .on('end', () => {
                resolve(returnData);
                try {
                    fs.unlinkSync(path.resolve(__dirname, '../uploadcsv', CSV))
                } catch (err) {
                    console.log(err);
                }
            })
            .on('error', (error) => {
                reject(error)
            })
    });
}

module.exports = { categoryuploadCsv }