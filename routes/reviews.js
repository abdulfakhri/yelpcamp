// Imports
const express = require("express");
const router = express.Router({mergeParams: true});

const reviews = require('../controllers/reviews.js');

const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

//Reviews
router.post('/',
    isLoggedIn,
    validateReview,
    reviews.createReview);

router.delete('/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    reviews.deleteReview);

module.exports = router;