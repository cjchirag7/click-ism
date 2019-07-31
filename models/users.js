var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
          required: true,      
      },
    lastname: {
        type: String,
         required: true,     
      },
      email:{
          type: String,
          required: true,
          unique: true
      },
      room:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 4 
      },
      block:{
        type: String,
        minlength: 1,
        maxlength: 2 ,
        required: true
      },
      hostel: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true
      },
      phone: {
        type: Number,
        minlength: 9,
        maxlength: 10
      },
    admin:   {
        type: Boolean,
        default: false
    },
    facebookProfile: {
      type: String,
      default: '-Not available-',
      minlength: 15,
      maxlength: 30
    },
    showfacebook: {
      type: Boolean,
      default: true
    },
    showphone: {
      type: Boolean,
      default: true
    },
    showroom: {
      type: Boolean,
      default: true
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);