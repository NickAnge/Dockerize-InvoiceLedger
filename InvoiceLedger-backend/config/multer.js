const express = require('express');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

exports.upload = multer({ //upload arguments
    storage: storage,
    limits: {  //for upload 
        fileSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});
