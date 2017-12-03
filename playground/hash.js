const bcrypt = require('bcryptjs');

let password = 'null';
let hashGen = '';
bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt,(err,hash)=>{
    console.log( err );
    console.log( hash );
    hashGen = hash;

    bcrypt.compare(password, hashGen,(err,res)=>{
      console.log(res);
      console.log(err);
    });


  });
});

