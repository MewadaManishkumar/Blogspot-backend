const multer = require('multer');
const _ = require('lodash');
const {AvatarStorage} = require('./AvatarStorage');

// setup a new instance of the AvatarStorage engine 
const storage = AvatarStorage({
    square: false,
    responsive: false,
    greyscale: false,
    quality: 90
});

const limits = {
    files: 1, // allow only 1 file per request
    fileSize:  3072 * 3072, // 3 MB (max file size)
};

const fileFilter = function (req, file, cb) {
    // supported image file mimetypes
    var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (_.includes(allowedMimes, file.mimetype)) {
        // allow supported image files
        cb(null, true);
    } else {
        // throw error for invalid files
        cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
    }
};

// setup multer
module.exports = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});