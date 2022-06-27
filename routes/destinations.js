const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const destinations = require('../controllers/destinations')
const {isLoggedIn,isAuthor,validator} = require('../utilities/middleware');
const multer  = require('multer');
const {storage} = require('../cloudinary/index')
const upload = multer({ storage });

router.get('/',catchAsync(destinations.index))

router.get('/new',isLoggedIn,destinations.renderNewForm)

router.post('/',isLoggedIn,upload.array('image'),validator,catchAsync(destinations.createNew))

router.get('/:id',catchAsync(destinations.show))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(destinations.renderEditForm))

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validator,catchAsync(destinations.edit))

router.delete('/:id',isAuthor,catchAsync(destinations.delete))

module.exports = router;