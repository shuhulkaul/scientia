var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema(
{
  fname: 
  {
    type: String,
    required: true,
    
  },
  lname: 
  {
    type: String,
    required: true,
    
  },
  dname: 
  {
    type: String,
    required: true,
    
  },
  mname: 
  {
    type: String,
    required: true,
    
  },
  coerid: 
  {
    type: Number,
    required: true,
    unique:true,
    trim:true
  },
  
  address: 
  {
    type: String,
    required: true,
    
  },
  day: 
  {
    type: String,
    required: true,
    
  },
  phone:
  {
      type: Number,
      required:true,
      unique:true
  },
  month: 
  {
    type: String,
    required: true,
    
  },
  year: 
  {
    type: String,
    required: true,
    
  },
  pincode: 
  {
    type: Number,
    required: true,
    trim:true
  },
  state: 
  {
    type: String,
    required: true,
    
  },
  hostel: 
  {
    type: String,
    required: true,
    
  },
  yoj: 
  {
    type: Number,
    required: true,
    
  },
  course: 
  {
    type: String,
    required: true,
    
  },
  email: 
  {
    type: String,
    required: true,
    trim:true,
    unique:true
  },
  password: 
  {
    type: String,
    required: true,
  },
  section: 
  {
    type: String
  },
  branch: 
  {
    type: String,
    default : '' 
  },
  image:
  {
    type: String,
    default: null
  }
});

var StudentPerm = module.exports = mongoose.model('studentperms', UserSchema);
module.exports.getUserByUsername = function(email, callback)
{
  var query = {email: email};
	StudentPerm.findOne(query, callback);
}
module.exports.getUserByUsername = function(email, callback)
{
  var query = {email: email};
	StudentPerm.findOne(query, callback);
}
module.exports.getSpreadsheet = function(query, callback)
{

}
module.exports.getUserByCoerId = function(coerid, email, callback)
{
	var query = {$and: [{coerid: coerid}, {email: email}]};
	StudentPerm.findOne(query, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback)
{
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) 
  {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
module.exports.getUserById = function(id, callback)
{
	StudentPerm.findById(id, callback);
}
module.exports.changePassword = function(generatedpassword, email)
{
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(generatedpassword, salt); 
  var myquery = { email: email };
  var newvalues = { $set: {password: hash } };
  StudentPerm.updateOne(myquery, newvalues, function(err, res) 
  {
    if (err) throw err;
    console.log("Password Changed!");
  });
}
