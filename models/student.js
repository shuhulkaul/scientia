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
  success:
  {
    type: Boolean,
    default:false
  }


});

var Student = module.exports = mongoose.model('studenttemps', UserSchema);

module.exports.createUser = function(newUser, callback)
{
  bcrypt.genSalt(10, function(err, salt) 
  {
      bcrypt.hash(newUser.password, salt, function(err, hash) 
      {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}
