const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploadcsv/')
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        )
    },
})

const uploadCsvFile = multer({ storage: storage })

module.exports = { uploadCsvFile }