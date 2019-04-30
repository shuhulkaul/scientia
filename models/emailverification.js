var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema(
  {
    email: 
    {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    code:
    {
      type: String,
      required: true
    }
  });

var Verify = module.exports = mongoose.model('emailverifications', UserSchema);

module.exports.checkcode = function(email, code, callback)
{ 
  var query ={$and: [{email:email}, {code:code}]};
  Verify.findOne(query, function(err, result) 
  {
    console.log(result);
    if(result) callback(null, result)
    else
    callback(null, null);
  })
};

module.exports.insert = function(email, code)
{
    Stringcode= code.toString();
    Verify.findOne({email:email}, function(err, result)
     {
      console.log("insert"+result+Stringcode);
       if (result) 
       {
        var myquery = {email : email};
        var update = {$set: { code : Stringcode}};
	      Verify.updateOne(myquery, update, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      }

      if(result==null)
      {
        var query = {email: email, code: Stringcode};
        Verify.create(query, function(err, result) 
        {
          if (err) throw err;
          console.log("1 document inserted");
        });
      }

      if(err)
      {
        console.log("MOFO");
      }
       
  })
};
