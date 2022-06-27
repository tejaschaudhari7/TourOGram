const express = require('express');
const Passport = require('passport');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');

const users = require('../controllers/users')

router.get('/register',users.renderRegistrationForm)

router.get('/logout', users.logout)

router.post('/register',catchAsync(users.register))

router.get('/login',users.renderLoginForm)

router.post('/login',Passport.authenticate('local',{failureFlash : true, failureRedirect : '/login'}),users.login)

module.exports = router;