const bcrypt = require('bcryptjs');

let password = null;

bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt,(err,hash)=>{
    console.log( err );
  });
});