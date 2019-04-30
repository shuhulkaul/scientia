var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
//models
var Student = require('../models/student');
var StudentPerm = require('../models/studentperm');
// Authentication
passport.use('student-local', new LocalStrategy(
	function (email, password, done) {
		StudentPerm.getUserByUsername(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			StudentPerm.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
				//session create
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));



//forgotpassword
router.get('/forgotpassword',
	function (req, res) {
			res.render('forgotpassword' , {title : 'Forgot Password | Scientia'});
	});

//POST studentlogin
router.post('/studentlogin',
	passport.authenticate('student-local', { successRedirect:'/users/studentdashboard/', failureRedirect: '/users/student/login', failureFlash: true }));

	//change password

	router.post('/changepassword',
	function (req, res) 
	{	
		var email = req.body.email;
		var coerid = req.body.coerid;
		if(!email || !coerid)
		{ 
			req.flash('error_msg', 'Invalid Email or COER ID');
			res.redirect('/users/student/login');
			res.end();
		}
		else {
			StudentPerm.getUserByUsername(email, function (err, user) {
				if (err) throw err;
				if (!user) {
					req.flash('error_msg', 'Invalid Email or COER ID');
					res.redirect('/userauthentication/forgotpassword');
					}
				StudentPerm.getUserByCoerId(coerid, email, function (err, isMatch) {
					if (err) throw err;
					if (isMatch) {
						//Email
							var generatedpassword = "";
							var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
						  
							for (var i = 0; i < 8; i++)
								generatedpassword += possible.charAt(Math.floor(Math.random() * possible.length));
							StudentPerm.changePassword(generatedpassword, email);
							
							//nodemailer
							var transporter = nodemailer.createTransport({
								service: 'gmail',
								auth: {
								  user: 'scientia.infinity@gmail.com',
								  pass: 'scIEntI@22'
								}
							  });
							  
							  var mailOptions = {
								from: 'scientia.infinity@gmail.com',
								to: email,
								subject: 'Your Scientia Password is changed',
								html: '<p>Dear '+ user.fname + ' ' + user.lname +' , <br> Your new password is '+ generatedpassword + '. Try not to lose it this time!</p><br> Warm Regards,<br> Scientia',
							
								
							
							};
							  
							transporter.sendMail(mailOptions, function(error, info){
								
								if (error) {
							
									console.log("ERROR :"+ error);		
								} else {
								
									console.log("INFO RESPONSE:" + info.response);
								}
							  });
							
							
							  req.flash('success_msg', 'Password Changed! Check your Email');
							  res.redirect('/users/student/login');	
							
						
					} else {
						req.flash('error_msg', 'Invalid Email or COER ID');
						res.redirect('/userauthentication/forgotpassword');	
					}
				}); 
			});
		}
		
	});
	
	module.exports = router;