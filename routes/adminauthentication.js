var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

//models
var Admin = require('../models/admin');

//Admin Strategy
passport.use('admin-local', new LocalStrategy(
	function (username, password, done) {
		Admin.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			Admin.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					//session created
				console.log("Match");
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));


//Check Student Login Credentials
router.post('/adminlogin',
	passport.authenticate('admin-local', {successRedirect:'/users/admindashboard/', failureRedirect: '/users/admin/login', failureFlash: true }));

	
    module.exports = router;