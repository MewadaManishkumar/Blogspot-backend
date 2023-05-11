const Users = require("../models/users");
const fs = require("fs");
const csv = require('csv-parser')
const path = require('path');
const bcrypt = require('bcrypt');

const uploadCsv = async (req, res) => { 
    try{
        let dataParsed = await parseCSV(req.file.filename) 
        let parsingArr = [];
            for(let i = 0; i < dataParsed.length; i++){
                let arrData = dataParsed[i]; 
                let dataToSave = {
                    name: arrData.name,
                    email: arrData.email,
                    username: arrData.username,
                    password: await bcrypt.hash(arrData.password,10),
                    role: req.params['role']
                };
                try{
                    if(!dataToSave.name || !dataToSave.email || !dataToSave.username ||!dataToSave.password ){
                        dataToSave.err_msg = 'One or more field is blank';
                        dataToSave.is_error = true;
                        parsingArr.push(dataToSave);
                    } 
                    else {
                        let emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                        if(!emailValidate.test(dataToSave.email)){
                            dataToSave.err_msg = 'Email format is invalid!';
                            dataToSave.is_error = true;
                            parsingArr.push(dataToSave);
                        }
                        else{
                            let checkingIfUserExiest = await Users.findOne({email: dataToSave.email});
                            if(checkingIfUserExiest){
                                dataToSave.err_msg = 'Email already in database';
                                dataToSave.is_error = true;
                                parsingArr.push(dataToSave); 
                            }else{
                                await Users.create(dataToSave)
                                dataToSave.err_msg = '';
                                dataToSave.is_error = false;
                                parsingArr.push(dataToSave);
                            }
                        } 
                    }
                }catch(err){
                    dataToSave.err_msg = 'Something went wrong!!';
                    dataToSave.is_error = true;
                    parsingArr.push(dataToSave);
                }
            } 
            res.json({
            msg: 'Data successfully inserted!', 
            data: parsingArr})
    }catch(err){
        res.json({msg: 'Something went wrong!! Data not inserted!'})
    }
}
 
function parseCSV(CSV){
    return new Promise((resolve, reject) => {
        let returnData = []
        fs.createReadStream(path.resolve(__dirname, '../uploadcsv', CSV))
        .pipe(csv())
        .on('data', async (data) => {
            returnData.push({
                name: data.name,
                email: data.email,
                username: data.username,
                password: data.password
            }); 
        })
        .on('end', () => {
            resolve(returnData);
            try{
                fs.unlinkSync(path.resolve(__dirname, '../uploadcsv', CSV))
            }catch(err){
                console.log(err);
            }
        })
        .on('error', (error)=>{
            reject(error)
        })
     });
}

  
module.exports = { uploadCsv }