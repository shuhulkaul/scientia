var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

var Admin = module.exports = mongoose.model('admins', UserSchema);

module.exports.getUserByUsername = function(username, callback)
{
	var query = {username: username};
	Admin.findOne(query, callback);
}

module.exports.getUserById = function(id, callback)
{
	Admin.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback)
{
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) 
  {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

