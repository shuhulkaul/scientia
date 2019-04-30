var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//models
var Admin = require('../models/admin');
var StudentPerm = require('../models/studentperm');
//error


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res)
{
	res.render('home', {title : 'Home | Scientia'});
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		res.redirect('/users/logout');
	} else {
		res.render('home', {title : 'Home | Scientia'});
		
		
	}
}

//serialize
passport.serializeUser(function (user, done) {
	
	done(null, user.id);
});

//deserialize
passport.deserializeUser(function (id, done) {
	if(id==='5c2f37b1bcee00912d726b47')
	{
		Admin.getUserById(id, function (err, user) {
		done(err, user); });
		}
	else
	{
		StudentPerm.getUserById(id, function (err, user) {
		done(err, user); });
		}

});

module.exports = router;