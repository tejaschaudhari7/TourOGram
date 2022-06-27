const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviews');
const {validator_review,isLoggedIn,isAuthor_review} = require('../utilities/middleware')


router.post('/',isLoggedIn,validator_review ,catchAsync(reviews.new))

router.delete('/:reviewId',isLoggedIn,isAuthor_review,catchAsync(reviews.delete))

module.exports = router;