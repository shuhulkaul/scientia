var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var multer = require('multer');
var queryObject = require('query-object');
var mongoXlsx = require('mongo-xlsx');
var crypto = require('crypto');
var fs = require('fs');
var http = require('http');
var PDFDocument = require('pdfkit')
var path = require('path');
var JsBarcode = require('jsbarcode');
var Canvas = require("canvas");
var maxSize=1*100*1000;
var maxidSize=1*200*1000;
var PDFmaxSize=1*1000*1000;
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/uploads/temp/')
	},
	filename: function (req, file, cb) {
	  crypto.pseudoRandomBytes(16, function (err, raw) {
		cb(null, raw.toString('hex') + Date.now() + '.' + 'jpg');
	  });
	}
  });

  var upload = multer({ storage: storage, limits: { fileSize: maxSize } }).single('myimage');
  var idupload = multer({ storage: storage, limits: { fileSize: maxidSize } }).single('idcard');
  var pdf10upload = multer({ storage: storage, limits: { fileSize: PDFmaxSize } }).single('tenthmarksheet');
  var pdf12upload = multer({ storage: storage, limits: { fileSize: PDFmaxSize } }).single('twelthmarksheet');
 
//models
var Student = require('../models/student');
var Verify = require('../models/emailverification');
var StudentPerm = require('../models/studentperm');

//Download Spreadsheet
router.post('/downloadsheet', function(req, res){
if((req.isAuthenticated())){
	
var i;
//var x1=0, x2=0, x3=0, x4=0, x5=0, x6=0, x7=0, x8=0, x9=0, x10=0, x11=0, x12=0, x13=0, x14=0, x15=0, x16=0, x17=0, x18=0;
var select= req.body.select;
var fname = req.body.fname;
var lname = req.body.lname;
var dname = req.body.dname;
var mname = req.body.mname;
var pincode = req.body.pincode;
var yoj = req.body.yoj;
var state = req.body.state;
var hostel = req.body.hostel;
var course = req.body.course;
var branch = req.body.branch;
var section = req.body.section;
req.checkBody('select', 'Select one of the checkboxes!').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('admindashboard', {
			errors: errors
		});
	}
	else {
var selectquery="?_id=0";
if (typeof select === 'string' || select instanceof String)
{
	if(select=='fname')
	{	selectquery+="&fname=1";
	}
	if(select=='lname')
	{	selectquery+="&lname=1";
	}
	if(select=='dname')
	{	selectquery+="&dname=1";
	}
	if(select=='mname')
	{	selectquery+="&mname=1";
	}
	if(select=='coerid')
	{	selectquery+="&coerid=1";
	}
	if(select=='address')
	{	selectquery+="&address=1";
	}
	if(select=='day')
	{	selectquery+="&day=1";
	}
	if(select=='month')
	{	selectquery+="&month=1";
	}
	if(select=='year')
	{	selectquery+="&year=1";
	}
	if(select=='phone')
	{	selectquery+="&phone=1";
	}
	if(select=='pincode')
	{	selectquery+="&pincode=1";
	}
	if(select=='state')
	{	selectquery+="&state=1";
	}
	if(select=='yoj')
	{	selectquery+="&yoj=1";
	}
	if(select=='hostel')
	{	selectquery+="&hostel=1";
	}
	if(select=='course')
	{	selectquery+="&course=1";
	}
	if(select=='branch')
	{	selectquery+="&branch=1";
	}
	if(select=='section')
	{	selectquery+="&section=1";
	}
	if(select=='email')
	{	selectquery+="&email=1";
	}	
}
for(i=0; i<select.length; i++)
{
	if(select[i]=='fname')
	{	selectquery+="&fname=1";
	}
	if(select[i]=='lname')
	{	selectquery+="&lname=1";
	}
	if(select[i]=='dname')
	{	selectquery+="&dname=1";
	}
	if(select[i]=='mname')
	{	selectquery+="&mname=1";
	}
	if(select[i]=='coerid')
	{	selectquery+="&coerid=1";
	}
	if(select[i]=='address')
	{	selectquery+="&address=1";
	}
	if(select[i]=='day')
	{	selectquery+="&day=1";
	}
	if(select[i]=='month')
	{	selectquery+="&month=1";
	}
	if(select[i]=='year')
	{	selectquery+="&year=1";
	}
	if(select[i]=='phone')
	{	selectquery+="&phone=1";
	}
	if(select[i]=='pincode')
	{	selectquery+="&pincode=1";
	}
	if(select[i]=='state')
	{	selectquery+="&state=1";
	}
	if(select[i]=='yoj')
	{	selectquery+="&yoj=1";
	}
	if(select[i]=='hostel')
	{	selectquery+="&hostel=1";
	}
	if(select[i]=='course')
	{	selectquery+="&course=1";
	}
	if(select[i]=='branch')
	{	selectquery+="&branch=1";
	}
	if(select[i]=='section')
	{	selectquery+="&section=1";
	}
	if(select[i]=='email')
	{	selectquery+="&email=1";
	}
}
// var selectquery ="_id :0, fname:"+x1+", lname:"+x2+", dname:"+x3+", mname:"+x4+", coerid:"+x5+", address:"+x6+", day:"+x7+", month:"+x8+", year:"+x9+", phone:"+x10+", pincode:"+x11+", state:"+x12+", yoj:"+x13+", hostel:"+x14+", course:"+x15+", branch:"+x16+", section:"+x17+", email:"+x18;

var wherequery="?__v=0";
if(fname)
{
	wherequery+='&fname='+fname+'';
}
if(lname)
{
	wherequery+='&lname='+lname+'';
}
if(dname)
{
	wherequery+='&dname='+dname+'';
}
if(mname)
{
	wherequery+='&mname='+mname+'';
}
if(pincode)
{
	wherequery+='&pincode='+pincode+'';
}
if(yoj)
{
	wherequery+='&yoj='+yoj+'';
}
if(state)
{
	wherequery+='&state='+state+'';
}
if(hostel)
{
	wherequery+='&hostel='+hostel+'';
}
if(course)
{
	wherequery+='&course='+course+'';
}
if(branch)
{
	wherequery+='&branch='+branch+'';
}
if(section)
{
	wherequery+='&section='+section+'';
}
var q1=queryObject.parse(wherequery);
var q2 =queryObject.parse(selectquery);
//selectquery='{'+selectquery+'}';
//wherequery='{'+wherequery+'}';
//var query = wherequery+', '+selectquery;
console.log("select=",q2);
console.log("where=",q1);
//console.log("query=", query);

StudentPerm.find(q1,q2,function(err, dockets){
	console.log("result=", dockets);
	if(dockets[0]==null)
	{
		if((req.isAuthenticated())){
			var x = 1;
			res.render('admindashboard', {noresult : x})
		}
		else{
			res.render('home');
		}
	}
	if(err)
	{
		console.log("err", err);
	}

	var model = mongoXlsx.buildDynamicModel(dockets);
	mongoXlsx.mongoData2Xlsx(dockets, model, function(err, dockets) {
		console.log('File saved at:', dockets.fullPath); 
		var saved = fs.createReadStream(dockets.fullPath);
		saved.on('end', function() {
			fs.unlink(dockets.fullPath, function() {
			});
		});
		saved.pipe(res);
	});
});
}
}
else
{
	res.redirect('/users/home');
}
});

// Registered--Dashboard redirect
router.get('/admindashboard', function (req, res) {
	if((req.isAuthenticated())){
	res.render('admindashboard', {title : 'Admin Dashboard | Scientia'});
	}
	else {
		res.redirect('/users/home');
	}
});

router.get('/firststep', function (req, res) {

	res.render('firststep' , {title : 'Email Verification | Scientia'});
});
router.get('/studentdashboard', function (req, res) {
	if(req.isAuthenticated()){
		res.render('studentdashboard' , {title : 'Student Dashboard | Scientia'});
		}
		else {
			res.redirect('/users/home');
		}
});

// Login Form

router.get('/admin/login', function(req, res){
	console.log("read");
	if(req.isAuthenticated())
	{
		console.log("yay");
		req.logout();
    console.log("res1", res.session);
	res.session = null;
		res.render('adminlogin' , {title : 'Admin Login | Scientia'});
	}
	else
	{
	res.render('adminlogin' , {title : 'Admin Login | Scientia'});
	}
});

router.get('/emailverification',  function(req, res){
	res.render('emailverification', {title : 'Verify Email | Scientia'});
});

router.get('/student/login',  function(req, res){
	res.render('studentlogin' , {title : 'Student Login | Scientia'});
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		res.redirect('/users/logout');
	} 
	else {
		res.render('home' , {title : 'Home | Scientia'});
		
		
	}
}

//logout to home
router.get('/home', ensureAuthenticated, function (req, res) {
	res.render('home' , {title : 'Home | Scientia'});
});

//Registration Form
router.get('/studentregister', function (req, res) {
	res.render('firststep'  , {title : 'Email Verification | Scientia'});
});

router.post('/idcard', function(req, res){

idupload(req, res, function(err)
{	
	if(req.isAuthenticated()){
	if(err)
	{
		req.flash('error_msg', 'The file is too large!');
		res.redirect('/users/studentdashboard');
		return;
	}
	else
	{
		if(req.file.mimetype!=="image/jpeg")
			{
				var a=1;
				req.flash('error_msg', "File type is not supported.")
				res.redirect("studentdashboard");
			}
			else {
		var yoj = req.body.yoj;
		var coerid= req.body.coerid;
		var branch = req.body.branch;
		var course = req.body.course;
		var newdir='./public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/';
		if(!fs.existsSync(newdir))
		{
			fs.mkdirSync(newdir,{recursive:true});
			fs.rename('./public/uploads/temp/'+req.file.filename,newdir+'idcard.jpg', function(err)
			{
				if(err) throw err;
				console.log('moved successfully!');
			});
		}
		else{
			fs.rename('./public/uploads/temp/'+req.file.filename,newdir+'idcard.jpg', function(err)
			{
				if(err) throw err;
				console.log('moved successfully!');
			});
		}
		

			req.flash('success_msg', 'The ID Card is uploaded successfully!');
			res.redirect('/users/studentdashboard');
	}
	}
}
else
{
	req.flash('error_msg', 'Your session timed out!');
	res.redirect('/users/home');
}
})

});

router.post('/collegeidcard', function (req, res) {
	if(req.isAuthenticated()){
		
	var fname = req.body.fname;
	var lname = req.body.lname;
	var coerid = req.body.coerid;
	var address = req.body.address;
	var hostel = req.body.hostel;
	var yoj = req.body.yoj;
	var phone = req.body.phone;
	var course = req.body.course;
	var branch = req.body.branch;
	var name= fname+' '+lname;
	var front, back, color;
	if(hostel=='Yes')
	{
	   front='./public/art/coeridcard-f-r.jpg';
		 back='./public/art/coeridcard-b-r.jpg';
		 color ='#D83031';
	}
	else
	{
		color ='#2F3E82';
		front='./public/art/coeridcard-f-b.jpg';
		back='./public/art/coeridcard-b-b.jpg';
	}
	if(course=='B.Tech')
	{	
		var sub;
		if(branch=='Computer Science and Engineering')
		{
			 sub ='CS';
		}
		if(branch=='Information Technology')
		{
			 sub ='IT';
		}
		if(branch=='Electronics and Telecommunication')
		{
			 sub ='ET';
		}
		if(branch=='Electrical and Electronics Engineering')
		{
			 sub ='EE';
		}
		if(branch=='Mechanical Engineering')
		{
			  sub ='ME';
		}
		if(branch=='Civil Engineering')
		{
			 sub ='CE';
		}
		if(branch=='Plasic and Polymer')
		{
			 sub ='PP';
		}
		if(branch=='Applied Electronics and Instrumentation')
		{
			  sub ='AEI';
		}


		var end= parseInt(yoj, 10)+4;
		var oneplus = parseInt(yoj, 10)+1;
		var session=yoj+'-'+oneplus;
		var fullsession = yoj+'-'+end;
	}
	else
	{	
		
		if(branch=='Computer Science and Engineering')
		{
			var sub ='CS';
		}
		if(branch=='Mechanical Engineering')
		{
			var sub ='ME';
		}
		var end= parseInt(yoj, 10)+2;
		var oneplus = parseInt(yoj, 10)+1;
		var session=yoj+'-'+oneplus;
		var fullsession = yoj+'-'+end;
	}

	var canvas = Canvas.createCanvas(1000, 250, "png");
	JsBarcode(canvas, coerid,{
		format: 'code128',
		width:4,
  		height:40,
	});
	var g = canvas.getContext("2d");
	g.fillStyle = "black";
	g.fillRect(200, 1000, 200, 1000);

	var buf = canvas.toBuffer();
	var bcode = './public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/';
	if(fs.existsSync(bcode)){
		fs.mkdirSync(bcode,{recursive : true});
	
	var bcodefile= bcode+'/test.png';
	fs.writeFileSync(bcodefile, buf);	
		doc = new PDFDocument;
		var photo ='./public/uploads/profile_picture/'+course+'/'+branch+'/'+coerid+'.jpg';
		if(fs.existsSync(photo)){
		
		
		var file = './public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/collegeidcard.pdf';
		var writeStream=fs.createWriteStream(file);
		doc.pipe(writeStream);
		doc.image(front, 5, 5, {width: 300});
		doc.image(back, 310, 5, {width: 300});
		doc.fillColor(color)
		doc.font('public/fonts/timesbi.ttf').fontSize(32).text(name,65, 312);
		doc.fillColor('black');
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text(coerid,75, 355);
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text(session,75, 375);
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(14).text(course+'.('+sub+')',75, 395);
			doc.fillColor(color)
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text(phone,372,92);
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text('15/08/'+yoj,380, 109);
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text('15/07/'+end,375, 129);
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text(address,360, 148);
				
		doc.image(bcodefile, 20,412, {height:55, width: 270});
		doc.image(photo, 89,129, {height:172, width: 129});
		doc.fillColor('black');
		doc.rotate(-90, { origin: [67,235] });
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(14).text(fullsession,67, 235);
		doc.rotate(90 * (-1), { origin: [67,235] });

		doc.end();
	
			writeStream.on('finish', function () {
				// do stuff with the PDF file
				res.download(file);
			});
		}
		else{
			res.render('studentdashboard',{photo:photo, title: 'Student Dashboard | Scientia'});
		}
	}
		
	}
	else {
		
		req.flash('error_msg', 'Your session timed out!');
		res.redirect('/users/home');
	}
});
router.post('/download', function (req, res) {
	if(req.isAuthenticated()){
	var yoj =req.body.yoj;
	console.log('yoj='+yoj);
	var coerid = req.body.coerid;
	var branch = req.body.branch;
	var course = req.body.course;
	var value = req.body.val;
	var tenth='./public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/10.pdf';
	var twelth = './public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/12.pdf';
	var idcard='./public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/idcard.jpg';
	

		if(value=='ten')
		{	
			if(!fs.existsSync(tenth)){
				res.render('admindashboard', {err: tenth, title: "Admin Dashboard | Scientia"} );
			}
			else
			res.download(tenth);
		}
		if(value=='twelve')
		{	
			
			if(!fs.existsSync(twelth)){
				res.render('admindashboard', {err: tenth, title:'Admin Dashboard | Scientia'} );
			}
			else
			res.download(twelth);
		}
		if(value=='id')
		{	
			
			if(!fs.existsSync(idcard)){
				res.render('admindashboard', {err: tenth, title:'Admin Dashboard | Scientia'} );
			}
			else
			res.download(idcard);
		}

		}
		else {
			res.redirect('/users/home');
		}


});



router.post('/search', function (req, res) {

	if(req.isAuthenticated()){
	var value = req.body.criteria;
	var search= req.body.search;
		var query;
	if(value=='fname')
	{
		 query={fname : search};
	}
	if(value=='lname')
	{
		 query={lname : search};
	}
	if(value=='dname')
	{
		 query={dname : search};
	}
	if(value=='mname')
	{
		 query={ mname : search};
	}
	if(value=='email')
	{
		 query={email : search};
	}
	if(value=='phone')
	{
		 query={phone : search};
	}
	if(value=='coerid')
	{
		 query={coerid : search};
	}
	if(value=='branch')
	{
		 query={branch : search};
	}
	if(value=='course')
	{
		 query={course : search};
	}
	if(value=='yoj')
	{
		 query={yoj : search};
	}
	if(value=='hostel')
	{
		 query={hostel : search};
	}

	StudentPerm.find(query, function(err, dockets){
			var str = dockets.toString();
			
			 if(dockets==''||dockets==null)
			{	
				if(req.isAuthenticated()){
					req.flash('error_msg', 'No result found!');
					res.redirect('/users/admindashboard');
					}
					else {
		
						req.flash('error_msg', 'Your session timed out!');
						res.redirect('/users/home');
					}
				
			}
			else
			{

			
		    var model = dockets.map(function (doc){
			return {
				"id"   : doc.id,
				"fname" : doc.fname,
				"lname" : doc.lname,
				"dname" : doc.dname,
				"mname" : doc.mname,
				"coerid" : doc.coerid,
				"address" : doc.address,
				"day" : doc.day,
				"month" : doc.month,
				"year": doc.year,
				"pincode" : doc.pincode,
				"state" : doc.state,
				"hostel" : doc.hostel,
				"yoj" : doc.yoj,
				"course" : doc.course,
				"email" : doc.email,
				"phone" : doc.phone,
				"section" : doc.section,
				"image": doc.image,
				"branch" : doc.branch
			}
		});
		if(req.isAuthenticated()){
			res.render('result', { doclist: model, title:'Search Results | Scientia' });
			}
			else {
		
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
		
	}
	});
	}
	else {
		
		req.flash('error_msg', 'Your session timed out!');
		res.redirect('/users/home');
	}
}
);

router.post('/upload12', function (req, res) {

	pdf12upload(req, res, function (err) {
		if (err) {

			if(req.isAuthenticated()){
				req.flash('error_msg', 'The File is too large!');
				res.redirect('/users/studentdashboard');
				return}
				else {
		
					req.flash('error_msg', 'Your session timed out!');
					res.redirect('/users/home');
				}
			
		
		}
		else
		{	
			if(req.file.mimetype!=="application/pdf")
			{
				var a=1;
				req.flash('error_msg', "File type is not supported.")
				res.redirect("studentdashboard");
			}
			else
			{
			var yoj =req.body.yoj;
			var coerid = req.body.coerid;
			var branch = req.body.branch;
			var course = req.body.course;
				var newdir = 'public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/';
				if(!fs.existsSync(newdir)){
					console.log(newdir);
					fs.mkdirSync(newdir,{recursive : true});
					fs.rename('public/uploads/temp/'+req.file.filename, newdir+'12.pdf', function(err){
						if (err) throw err;
						console.log('Move complete.');
	
	
					});
	
				}
				else{
					fs.rename('public/uploads/temp/'+req.file.filename, newdir+'12.pdf', function(err){
						if (err) throw err;
						console.log('Move complete.');
	
	
					});
				}
				


				if(req.isAuthenticated()){
					req.flash('success_msg', 'The File is added successfully!');
					res.redirect('/users/studentdashboard');}
					else {
		
						req.flash('error_msg', 'Your session timed out!');
						res.redirect('/users/home');
					}
				
			
		
		}
	}
		// Everything went fine
	  });



});
router.post('/upload10', function (req, res) {

	pdf10upload(req, res, function (err) {
		if (err) {
			if(req.isAuthenticated()){
				req.flash('error_msg', 'The File is too large!');
			res.redirect('/users/studentdashboard');
		  return}
		  else {
		
			req.flash('error_msg', 'Your session timed out!');
			res.redirect('/users/home');
		}
		}
		else
		{	
			if(req.file.mimetype!=="application/pdf")
			{
				var a=1;
				req.flash('error_msg', "File type is not supported.")
				res.redirect("studentdashboard");
			}
			else
			{
			var yoj =req.body.yoj;
			var coerid = req.body.coerid;
			var branch = req.body.branch;
			var course = req.body.course;
				var newdir = 'public/uploads/documents/'+course+'/'+branch+'/'+yoj+'/'+coerid+'/';
				if(!fs.existsSync(newdir)){
					console.log(newdir);
					fs.mkdirSync(newdir,{recursive : true});
					fs.rename('public/uploads/temp/'+req.file.filename, newdir+'10.pdf', function(err){
						if (err) throw err;
						console.log('Move complete.');
	
	
					});
	
				}
				else{
					fs.rename('public/uploads/temp/'+req.file.filename, newdir+'10.pdf', function(err){
						if (err) throw err;
						console.log('Move complete.');
	
	
					});
				}
				

				if(req.isAuthenticated()){
				req.flash('success_msg', 'The File is added successfully!');
				res.redirect('/users/studentdashboard');
					
			  }else {
		
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
				
				
		}
		
		}
			   
		// Everything went fine
	  });


});
//Bonafide pdf generation
router.post('/bonafide', function(req, res){
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var fname = req.body.fname;
	var lname = req.body.lname;
	var dname = req.body.dname;
	var coerid = req.body.coerid;
	var yoj = req.body.yoj;
	var course = (req.body.course).toString();
	var branch = req.body.branch;
	function bonafide(course, diff, val)
	{	//btech
		if(course=='B.Tech')
		{
			if(diff<4)
			{
				if(val==0)
				{
					var bonyear=y;
				
				}
				else
				{
					var bonyear=y+1;
				}
			}

			else
			{
				if(val==0)
				{
					var bonyear=y-1;

				}
				else
				{
					if(req.isAuthenticated()){
						
						req.flash('error_msg', 'You are not eligible for a bonafide certificate!');
				    res.redirect('/users/studentdashboard');	
					  }else {
		
						req.flash('error_msg', 'Your session timed out!');
						res.redirect('/users/home');
					}
					
				}

			}
		}

		//bba, bca, bcom

		if(course=='BBA'||course=='B.Com'||course=='BCA')
		{
			if(diff<3)
			{
				if(val==0)
				{
					var bonyear=y;
				
				}
				else
				{
					var bonyear=y+1;
				}
			}

			else
			{
				if(val==0)
				{
					var bonyear=y-1;

				}
				else
				{	if(req.isAuthenticated()){
						req.flash('error_msg', 'You are not eligible for a bonafide certificate!');
				    res.redirect('/users/studentdashboard');
				  }
				  else {
		
					req.flash('error_msg', 'Your session timed out!');
					res.redirect('/users/home');
				}
					
				}

			}
		}

		//mba mtech mca
		if(course=='MBA'||course=='MCA'||course=='M.Tech')
		{
			if(diff<1)
			{
				if(val==0)
				{
					var bonyear=y;
				
				}
				else
				{
					var bonyear=y+1;
				}
			}

			else
			{
				if(val==0)
				{
					var bonyear=y-1;

				}
				else
				{if(req.isAuthenticated()){
						req.flash('error_msg', 'You are not eligible for a bonafide certificate!');
				    res.redirect('/users/studentdashboard');
				  }else {
		
					req.flash('error_msg', 'Your session timed out!');
					res.redirect('/users/home');
				}
					
				}

			}
		}
		var x=bonyear+1;
		var z=x.toString();
		var shbonyear=z.substring(2,4);
		doc = new PDFDocument;
		var newdir = 'public/uploads/bonafide_pdf/'+course+'/'+branch+'/';
		if(!fs.existsSync(newdir)){
		fs.mkdirSync(newdir,{recursive : true});
		}
		
		var file ='public/uploads/bonafide_pdf/'+course+'/'+branch+'/'+coerid+'.pdf';
		var writeStream=fs.createWriteStream(file);
		doc.pipe(writeStream);
		doc.image('public/art/form-header.jpg', 0, 0, {width: 610});
		doc.font('public/fonts/arial.ttf')
			.fontSize(12).text('Date: '+monthNames[m]+' '+d+', '+y, 410, 150);
		// Set the paragraph width and align direction
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(14).text('TO WHOM IT MAY CONCERN',  210, 200,{underline : true});
		doc.font('public/fonts/arial.ttf')
			.fontSize(12).text('This is to certify that '+ fname + ' '+ lname+ ' S/o Mr.'+ dname +' is bonafide student of ' +course +' ('+branch+')'+' of College of Engineering Roorkee (COER), during the session '+bonyear+'-'+shbonyear+' which is approved by AICTE, Delhi and Uttarakhand Government and affiliated to Uttarakhand technical University, Dehradun.', 60, 250,{lineGap : 2});					
		doc.font('public/fonts/arialbd.ttf')
			.fontSize(12).text('Dean (Academics)', 60, 360);
			doc.end();
	
			writeStream.on('finish', function () {
				// do stuff with the PDF file
				res.download(file);
			});
		//req.flash('success_msg', 'The Document is successfully downloaded!');
				
	
		
	}
	//Validation
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth();
	var diff= y-yoj;

	if(course=='B.Tech')
	{
		if(diff<5){
			if(m<7)
			{
				bonafide(course, diff, 0);
			}
			else{
				bonafide(course, diff, 1);
			}
			
		}
		else{	
			if(req.isAuthenticated()){
				req.flash('error_msg', 'You are not eligible for a bonafide certificate!');
				res.redirect('/users/studentdashboard');
					
			  }
			  else {
		
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
				
		}
	}
	if(course=='BBA'||course=='B.Com'||course=='BCA')
	{

		if(diff<4)
		{
			if(m<7)
			{
				bonafide(course,diff, 0);
			}
			else{
				bonafide(course,diff, 1);
			}
		}
		else{
			if(req.isAuthenticated()){
				
				req.flash('error_msg', 'You are not eligible for a bonafide certificate!');
				res.redirect('/users/studentdashboard');
					
			  }
			  else {
		
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
			
		}

	}
	if(course=='MBA'||course=='MCA'||course=='M.Tech')
	{
		if(diff<3)
		{
			if(m<7)
			{
				bonafide(course,diff, 0);
			}
			else{
				bonafide(course,diff, 1);
			}
		}
		else{
			if(req.isAuthenticated()){
					req.flash('error_msg', 'You are not eligible for a bonafide certificate!');
				res.redirect('/users/studentdashboard');
			  }
			  else {
		
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
			
		}
	}


	

});
//Profile pdf generation
router.post('/profilepdf', function(req, res){
	
	
	var fname = req.body.fname;
	var lname = req.body.lname;
	var dname = req.body.dname;
	var mname = req.body.mname;
	var coerid = req.body.coerid;
	var address = req.body.address;
	var day= req.body.day;
	var month = req.body.month;
	var year = req.body.year;
	var pincode = req.body.pincode;
	var state = req.body.state;
	var hostel = req.body.hostel;
	var yoj = req.body.yoj;
	var phone = req.body.phone;
	var course = req.body.course;
	var email = req.body.email;
	var branch = req.body.branch;
	var section = req.body.section;
	
	doc = new PDFDocument;
	var newdir = 'public/uploads/profile_pdf/'+course+'/'+branch+'/';
	if(!fs.existsSync(newdir)){
	fs.mkdirSync(newdir,{recursive : true});
	}
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var file =newdir+coerid+'.pdf';
	var writeStream = fs.createWriteStream(file);
	doc.pipe(writeStream);
	doc.image('public/art/form-header.jpg', 0, 0, {width: 640});
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text('Date: '+monthNames[m]+' '+d+', '+y, 410, 150);
	// Set the paragraph width and align direction
	doc.font('public/fonts/arialbd.ttf')
		.fontSize(14).text('TO WHOM IT MAY CONCERN',  210, 200,{underline : true});
	doc.image('public/art/layout-pdf.jpg', 100, 240, {width: 410});
	//name
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(fname+' '+ lname, 220, 255);	
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(dname, 220, 280);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(mname, 220, 308);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(coerid, 220, 335);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(day+'/'+month+'/'+year, 220, 360);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(address, 220, 390);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(pincode, 220, 460);	
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(state, 220, 490);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(hostel, 220, 515);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(yoj, 220, 543);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(course, 220, 570);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(email, 220, 597);	
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(branch, 220, 622);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(section, 220,652);
	doc.font('public/fonts/arial.ttf')
		.fontSize(12).text(phone, 220, 677);									
	doc.end();

	//req.flash('success_msg', 'The Document is successfully downloaded!');
	writeStream.on('finish', function () {
		// do stuff with the PDF file
		res.download(file, 'profile.pdf');
	});
		
	//res.redirect('/users/studentdashboard');
  });
  
	

router.post('/uploadphoto',  function(req, res)
{
	upload(req, res, function (err) {
		if (err) {
			if(req.isAuthenticated()){
				console.log("err", err);
			res.redirect('/users/studentdashboard');	
			  }
			  else {
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
			
		  return
		}
		else
		{
			if(req.file.mimetype!=="image/jpeg")
		{
			var a=1;
			req.flash('error_msg', "File type is not supported.")
			res.redirect("studentdashboard");
		}
	else
	{
			console.log(req.file.filename);
			var tempfname= req.file.filename;
			var index= tempfname.indexOf('.');
			var extention = tempfname.substring(index,tempfname.length);
			var coerid = req.body.coerid;
			var branch = req.body.branch;
			var course = req.body.course;
			var query = {coerid : coerid};
    		var update = {$set: { image : coerid+extention}};
			StudentPerm.updateOne(query, update, function(err,result){
			if(err) console.log(err)
			else{

				console.log("Image url added");
				
				var newdir = 'public/uploads/profile_picture/'+course+'/'+branch+'/';
				if(!fs.existsSync(newdir)){
					console.log(newdir);
					fs.mkdirSync(newdir,{recursive : true});
					fs.rename('public/uploads/temp/'+req.file.filename, newdir+coerid+'.jpg', function(err){
						if (err) throw err;
						console.log('Move complete.');
	
	
					});
	
				}
				else{
					fs.rename('public/uploads/temp/'+req.file.filename, newdir+coerid+'.jpg', function(err){
						if (err) throw err;
						console.log('Move complete.');
	
	
					});
				}
				


				if(req.isAuthenticated()){
					req.flash('success_msg', 'The Image is added successfully!');
				res.redirect('/users/studentdashboard');	
				  }else {
		
					req.flash('error_msg', 'Your session timed out!');
					res.redirect('/users/home');
				}
				
			}
			});
		}
	}
		// Everything went fine
	  });

	
});


//email auth
router.post('/emailauth2', function (req, res) {
	var email = req.body.username;
	var entcode = req.body.password;
	
	Verify.checkcode(email, entcode, function(err, result)
	{
		if(result)
		{	res.render('studentregister',{email:email, title:'Student Registration | Scientia'});
			
			
		}
		else
		{	
			req.flash('error_msg', 'The Validation code is incorrect.');
			res.redirect('/users/firststep');
			
			
		}

	})	
});
router.post('/matchpassword', function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	var errors = req.validationErrors();

	if (errors) {
		if(req.isAuthenticated()){
				res.render('studentdashboard', {
			errors: errors,
			title : 'Student Dashboard | Scientia'
		});
		  }
		  else {
		
			req.flash('error_msg', 'Your session timed out!');
			res.redirect('/users/home');
		}
		
	}
	else {
		console.log(password+email);
		StudentPerm.changePassword(password, email);

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'scientia.infinity@gmail.com',
			pass: 'scIEntI@22'
			}
		});
		
		var mailverificationOptions = {
			from: 'scientia.infinity@gmail.com',
			to: email,
			subject: 'Password successfully changed!',
			html: '<p> Your Scientia account password has been changed. </p><br><br>Warm Regards,<br> Scientia',
		};
		
		transporter.sendMail(mailverificationOptions, function(error, info){
			
			if (error) {
		
				console.log("ERROR :"+ error);	
				s.abort();	
			} else {
				
				console.log("INFO RESPONSE:" + info.response);
				s.abort();
			}
		});		
	}
	if(req.isAuthenticated()){
			res.render('studentdashboard',{done:email, title: 'Student Dashboard | Scientia'});
	  }
	  else {
		
		req.flash('error_msg', 'Your session timed out!');
		res.redirect('/users/home');
	}
});

router.post('/changepassword', function(req, res){
	var email = req.body.email;
	console.log(email);
	if(req.isAuthenticated()){
			res.render('changepassword', {email:email, title: 'Change Password | Scientia'});
	  }
	  else {
		
		req.flash('error_msg', 'Your session timed out!');
		res.redirect('/users/home');
	}
});
router.post('/approve', function(req, res){
	var coerid = req.body.coerid;
	var note = req.body.note;

	console.log('coerid'+coerid);
	var s=Student.findOne({coerid:coerid}, function(err, document)
	{	console.log('doc'+ document);
	console.log('doc-name'+ document.fname);

		var fname = document.fname;
		var lname = document.lname;
		var dname = document.dname;
		var mname = document.mname;
		var coerid = document.coerid;
		var address = document.address;
		var day = document.day;
		var month = document.month;
		var year = document.year;
		var pincode = document.pincode;
		var state = document.state;
		var hostel = document.hostel;
		var yoj = document.yoj;
		var course = document.course;
		var email = document.email;
		var phone = document.phone;
		var password = document.password;
		var section = document.section;
		var branch = document.branch;
		var success = document.success;

		var myquery = {email : email};
        var update = {$set: { success : true}};
	      Student.updateOne(myquery, update, function(err, res) {
          if (err) throw err;
          console.log("false to true");
        });

		
		var query={fname : fname, lname:lname, dname:dname, mname:mname, coerid:coerid, address:address, day: day, month:month, year:year, pincode:pincode, state:state, hostel:hostel, yoj:yoj, course:course, email:email, branch:branch, password:password, phone:phone, section:section}
			StudentPerm.create(query, function(err, succ){
				if(err) console.log(err);
				if(succ)
				{
					console.log("Record Created!");
					var transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
						user: 'scientia.infinity@gmail.com',
						pass: 'scIEntI@22'
						}
					});
					
					var mailverificationOptions = {
						from: 'scientia.infinity@gmail.com',
						to: email,
						subject: 'Your Scientia account has been activated!',
						html: '<p> Dear '+fname+',<br> Your account has been activated. You can now login. </p><br> <b>NOTE:<b> '+note+'<br>Warm Regards,<br> Scientia',

					};
					
					transporter.sendMail(mailverificationOptions, function(error, info){
						
						if (error) {
					
							console.log("ERROR :"+ error);	
							s.abort();	
						} else {
							
							console.log("INFO RESPONSE:" + info.response);
							s.abort();
						}
					});	
					if(req.isAuthenticated()){
						req.flash('success_msg', 'The User is added successfully!');
				res.redirect('/users/admindashboard');	
					  }
					  else {
		
						req.flash('error_msg', 'Your session timed out!');
						res.redirect('/users/home');
					}

					
				}
				
			});
		 
	});

});
router.post('/disapprove', function(req, res){
	var coerid = req.body.coerid;
	var note = req.body.note;
	var name = req.body.name;
	var email = req.body.email;
	var r= Student.deleteOne({coerid:coerid}, function(err, suc)
	{
		if(err) console.log(err);
		if(suc)
		{
			console.log("Record Deleted!");
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
				user: 'scientia.infinity@gmail.com',
				pass: 'scIEntI@22'
				}
			});
			
			var mailverificationOptions = {
				from: 'scientia.infinity@gmail.com',
				to: email,
				subject: 'Your Scientia account has been disapproved!',
				html: '<p> Dear '+name+',<br> Your request of activation of your account has been disapproved. Please Try Again! </p><br> <b>NOTE:<b> '+note+'<br>Warm Regards,<br> Scientia',
			
				
			
			};
			
			transporter.sendMail(mailverificationOptions, function(error, info){
				
				if (error) {
			
					console.log("ERROR :"+ error);	
					r.abort();	
				} else {
				
					console.log("INFO RESPONSE:" + info.response);
					r.abort();
				}
			});	
			if(req.isAuthenticated()){
					req.flash('error_msg', 'The User has been disapproved!');
			res.redirect('/users/admindashboard');
			  }
			  else {
		
				req.flash('error_msg', 'Your session timed out!');
				res.redirect('/users/home');
			}
			
		}
		
	});

});


router.post('/pendingregistration', function(req, res){
	
	Student.find({success: false}, function(err, dockets){
		
		var model = dockets.map(function (doc){
			return {
				"id"   : doc.id,
				"fname" : doc.fname,
				"lname" : doc.lname,
				"dname" : doc.dname,
				"mname" : doc.mname,
				"coerid" : doc.coerid,
				"address" : doc.address,
				"day" : doc.day,
				"month" : doc.month,
				"year": doc.year,
				"pincode" : doc.pincode,
				"state" : doc.state,
				"hostel" : doc.hostel,
				"yoj" : doc.yoj,
				"course" : doc.course,
				"email" : doc.email,
				"phone" : doc.phone,
				"password" : doc.password,
				"section" : doc.section,
				"branch" : doc.branch
			}
		});
		res.render('pending', { doclist: model,
		title: "Pending Registrations | Scientia" });
	});
	
});



router.post('/emailauth', function (req, res) {
	var email = req.body.username;
	req.checkBody('username', 'Email is required').notEmpty();
	req.checkBody('username', 'Email is not valid').isEmail();
	var errors = req.validationErrors();
	if (errors) {
		
		res.render('firststep', {
			errors: errors,
			title : 'Email Verification | Scientia'
		});
	}
	else
	{
	Student.findOne({ email: { "$regex": "^" + email + "\\b", "$options": "i"}}, function (err, mail) {
		if (mail) {
			res.render('firststep', {mail: mail,
			title : 'Email Verification | Scientia'
			})	
			
				
			}

		else
		{

								//MAKING A VERIFICATION CODE FOR EMAIL VERIFICATION
								var verificationcode = "";
								var possible = "0123456789";
								for (var i = 0; i < 4; i++)
								verificationcode += possible.charAt(Math.floor(Math.random() * possible.length));
								
									//MAILING VERIFICATION CODE				
	
								var transporter = nodemailer.createTransport({
									service: 'gmail',
									auth: {
									user: 'scientia.infinity@gmail.com',
									pass: 'scIEntI@22'
									}
								});
								
								var mailverificationOptions = {
									from: 'scientia.infinity@gmail.com',
									to: email,
									subject: 'Scientia Email Verification Code',
									html: '<p> Your Email Verification code is '+ verificationcode + '. Please enter this to verify your email address!</p><br> Warm Regards,<br> Scientia',
								
									
								
								};
								
								transporter.sendMail(mailverificationOptions, function(error, info){
									
									if (error) {
								
										console.log("ERROR :"+ error);		
									} else {
									
										console.log("INFO RESPONSE:" + info.response);
									}
								});	
								Verify.insert(email, verificationcode);
								res.render('verifyemail', {code : verificationcode, email : email, title : 'Verify Code | Scientia' });
								
								

		}
			
		});
}
		});


// Register Student
router.post('/studentregform', function (req, res) {

	var fname = req.body.fname;
	var lname = req.body.lname;
	var dname = req.body.dname;
	var mname = req.body.mname;
	var coerid = req.body.coerid;
	var address = req.body.address;
	var day= req.body.day;
	var month = req.body.month;
	var year = req.body.year;
	var pincode = req.body.pincode;
	var state = req.body.state;
	var hostel = req.body.hostel;
	var yoj = req.body.yoj;
	var phone = req.body.phone;
	var course = req.body.course;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var branch = req.body.branch;
	if(branch=="")
	{
		branch = req.body.branch2;
	}
	var section = req.body.section;
	console.log('branch:'+branch);
console.log('phone='+phone);
	

// Validation
	req.checkBody('fname', 'First Name is required').notEmpty();
	req.checkBody('lname', 'Last Name is required').notEmpty();
	req.checkBody('dname', "Father's Name is required").notEmpty();
	req.checkBody('mname', "Mother's Name is required").notEmpty();
	req.checkBody('coerid', 'COER ID is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('day', "Day Range is not valid").isInt({min: 1, max:31});
	req.checkBody('month', "Month range is not valid").isInt({min: 1, max:12});
	req.checkBody('year', "Year range is not valid").isInt({min: 1980, max:2005});
	req.checkBody('pincode', 'Pincode is required').notEmpty();
	req.checkBody('phone', 'Phone Number is required').notEmpty();
	req.checkBody('phone', 'Phone Number is not valid!').isInt({min: 60000000, max:9999999999});
	req.checkBody('state', 'State is required').notEmpty();
	req.checkBody('hostel', 'Do you live in the college hostel?').notEmpty();
	req.checkBody('yoj', 'Year of Joining is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('course', 'Select a course').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('section', 'Section is required').notEmpty();
	req.checkBody('hostel', 'Are you a hosteller?').notEmpty();
	var errors = req.validationErrors();

	if (errors) {
		
		res.render('firststep', {
			errors: errors
		});
	}
	else {
			

		//checking if email, username are already taken				
	Student.findOne({phone : phone}, function(err, mobile){
		Student.findOne({ coerid: coerid 
			}, function (err, id) { console.log(1);
					Student.findOne({ email: { 
						"$regex": "^" + email + "\\b", "$options": "i"
				}}, function (err, x) {
						if (id || x || mobile) {
							res.render('firststep', {
								
								id: id,
								x: x,
								mobile : mobile,
								title : 'Email Verification | Scientia'
							});
						}
						else {
							console.log(2);
							console.log(phone);
							var newUser = new Student({
								
								fname : fname,
								lname : lname,
								dname : dname,
								mname : mname,
								coerid : coerid,
								address : address,
								day : day,
								month : month,
								year: year,
								pincode : pincode,
								state : state,
								hostel : hostel,
								yoj : yoj,
								course : course,
								email : email,
								phone : phone,
								password : password,
								section : section,
								branch : branch
								
							});
							Student.createUser(newUser, function (err, user) {
								if (err) throw err;
								//console.log(user);
							});

							req.flash('success_msg', 'Your registration request is sent successfully. Please wait for approval email.');
							res.redirect('/users/student/login');
						}
					});
				});
			});
			
	}
});






//session logout
router.get('/session_logout', function (req, res) {
		req.logout();
		req.flash('error_msg', 'Your session is logged out');
		res.redirect('/users/home');
	});
	

//logout
router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/home');
});

module.exports = router;