//Import
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {storeReturnTo} = require('../middleware.js');

//Controller
const users = require('../controllers/users.js');

//Routes
router.route('/register')
    .get(users.renderRegister)
    .post(users.registerUser);

router.route('/login')
    .get(users.loginUser)
    .post(
        storeReturnTo,
        passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), //Authentication
        users.loginAlert);

router.route('/logout')
    .get(users.logoutUser);

//Export
module.exports = router;