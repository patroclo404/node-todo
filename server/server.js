require('./config/config');


const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

let {mongoose} = require('./db/mongoose');
let { User } = require('./models/user');
let { Todo } = require('./models/todo');
let { authenticate } = require('./midelware/auth')

let app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, ( req, res)=>{
  
  var todo = new Todo({
    text : req.body.text,
    _creator : res.user._id
  });

  todo.save().then(doc=>{
    res.status(201).send(doc);
  },error=>{
    res.status(400).send(error);
  });
});

app.get('/todos', authenticate, ( req, res ) => {

  Todo.find({
    _creator : res.user.id
  }).then( todos => {
    res.send({todos}) 
  }, error => {
    res.status(400).send(error);
  });

});

app.get('/todos/:id', authenticate, (req,res)=>{

  Todo.findOne({ 
    _id : req.params.id ,
    _creator : res.user._id
  }).then( todo=>{
    if( !todo ){
      return res.status(404).send({ message : "Not found" });
    }
    res.send( {todo} );
  }, e => { res.status(400).send(e) } );

});

app.delete('/todos/:id', authenticate, (req,res)=>{
  if( !ObjectID.isValid( req.params.id )){
    return res.status(400).send({ message : "Invalid id" });
  }


  Todo.findOneAndRemove({
    _id : req.params.id ,
    _creator : res.user._id
  }).then( todo=>{
    if( !todo )
      return res.status(404).send({ message : "Not found" });
    res.status(200).send({todo});
  }, e =>{res.status(500).send(e)});


});

app.patch('/todos/:id', authenticate, (req,res)=>{
  let id = req.params.id;
  let body = _.pick(req.body, ['text','completed']);

  if(!ObjectID.isValid(id))
    return res.status(404).send({message : 'Unable to find todo'});

  if( _.isBoolean(body.completed) && body.completed ){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    {
      _id : req.params.id ,
      _creator : res.user._id
    },
    { $set : body },
    { new : true }
  ).then((todo)=>{
      if( !todo )
        return res.status(404).send({message : 'Unable to find todo'});
      res.send({todo});      
    }).
    catch((e)=>{
      return res.status(400).send({message : 'Error updating todo'});
    })
});

//users

app.post('/user',(req,res)=>{
  let body = _.pick(req.body, ['email','password']);
  let user = new User(body);

  user.save().then(doc=>{
    //res.status(201).send(doc);
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).status(201).send(user);
  }).catch((error)=>{
    res.status(400).send({error,message:'bad request'});
  });
});

app.get('/user/me', authenticate, (req,res) => {
  res.send(res.user);
});

app.post('/user/login',(req,res) => {
  let body = _.pick(req.body, ['email','password']);
  User.findByCredentials(body).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).status(200).send(user);
    });
  }).catch((error) => {
    console.log(error)
    res.status(400).send({error,message:'Bad request'});
  })
});

app.delete('/user/me/token',authenticate,(req,res)=>{

  res.user.removeToken(res.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send({});
  });
})

app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = { app };