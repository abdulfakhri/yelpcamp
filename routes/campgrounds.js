// Imports
const express = require("express");
const router = express.Router();
const campgrounds = require('../controllers/campgrounds.js');

// Cloudinary Image upload
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

// Middleware
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware.js");

//Routes
router.route('/')
    .get(campgrounds.index)
    .post(
        isLoggedIn, upload.array('image'),
        validateCampground,
        campgrounds.createCampground);

router.get('/new',
    isLoggedIn,
    campgrounds.renderNewForm);

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image'),
        validateCampground,
        campgrounds.updateCampground)
    .delete(
        isLoggedIn,
        campgrounds.deleteCampground);

router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    campgrounds.renderEditForm);

//Export
module.exports = router;