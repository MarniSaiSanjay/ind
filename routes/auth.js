const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth');
const { catchAsyncError } = require('../middleware');

router.route('/login')
    .get(authController.login_get)
    .post(passport.authenticate('local', {  failureRedirect: '/users/login' }), catchAsyncError(authController.login_post));


router.route('/register')
    .get(authController.register_get)
    .post(catchAsyncError(authController.register_post));

router.get('/logout', authController.logout);

module.exports = router;
