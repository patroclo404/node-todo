
let { User } = require('../models/user');

let authenticate = (req,res,next) => {
  let token = req.header('x-auth');
  
  User.findByToken(token).then((user)=>{

    if( !user ) return res.status(404).send({message : 'not found'});

    res.user = user;
    res.token = token
    next();
  }).catch((error)=>{
    res.status(401).send({error});
  });
}

module.exports = {authenticate};