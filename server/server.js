let env = process.env.NODE_ENV || 'development';

if( env === 'development' ){
  process.env.PORT = 3000;
}else if( env === 'test' ){
  process.env.PORT = 3000;
}


const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash')

let {mongoose} = require('./db/mongoose');
let { User } = require('./models/user');
let { Todo } = require('./models/todo');

let app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',( req, res)=>{
  
  var todo = new Todo({
    text : req.body.text
  });

  todo.save().then(doc=>{
    res.status(201).send(doc);
  },error=>{
    res.status(400).send(error);
  });


});

app.get('/todos',( req, res ) => {

  Todo.find().then( todos => {
    res.send({todos}) 
  }, error => {
    res.status(400).send(error);
  });

});

app.get('/todos/:id',(req,res)=>{

  Todo.findById( req.params.id ).then( todo=>{
    if( !todo ){
      return res.status(404).send({ message : "Not found" });
    }
    res.send( {todo} );
  }, e => { res.status(400).send(e) } );

});

app.delete('/todos/:id',(req,res)=>{
  if( !ObjectID.isValid( req.params.id )){
    return res.status(400).send({ message : "Invalid id" });
  }


  Todo.findByIdAndRemove( req.params.id ).then( todo=>{
    if( !todo )
      return res.status(404).send({ message : "Not found" });
    res.status(200).send({todo});
  }, e =>{res.status(500).send(e)});


});

app.patch('/todos/:id',(req,res)=>{
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

  Todo.findByIdAndUpdate( id,
    { $set : body },
    { new : true }).
    then((todo)=>{
      if( !todo )
        return res.status(404).send({message : 'Unable to find todo'});

      res.send({todo});
      
    }).
    catch((e)=>{
      return res.status(400).send({message : 'Error updating todo'});
    })
});

app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = { app };