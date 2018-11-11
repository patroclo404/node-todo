const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email :{
    type: String,
    required : true,
    minlength : 1,
    trim : true,
    unique : true,
    validate : {
      validator : validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  password : {
    type : String,
    required: true,
    minlength : 6
  },
  tokens : [{
    access:{
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]
});

UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token,process.env.JWT_SECRET);
  } catch (error) {
    return Promise.reject(error);
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};

UserSchema.statics.findByCredentials = function (cred) {
  let User = this;
  return User.findOne({
    'email' : cred.email
  }).then((user)=>{
    if(!user) return Promise.reject();

    return new Promise((resolve,reject)=>{
      bcrypt.compare(cred.password,user.password,(err, res)=>{
        if( err || !res ) return reject()
        return resolve(user);
      })
    });    
  })
};

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.contat({access , token});

  return user.save().then(()=>{
    return token;
  })
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull : {
      tokens : {token}
    }
  });
};

UserSchema.pre('save', function(next){
  let user = this;

  if( user.isModified('password') ){
    bcrypt.genSalt(10, (err,salt)=>{
      bcrypt.hash(user.password, salt,(err,hash)=>{

        if( err ){
          let msg = new Error('something went wrong');
          next(msg);
        }

        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }

});

let  User = mongoose.model('Users', UserSchema );

module.exports = {User};