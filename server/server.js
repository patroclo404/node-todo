var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var { User } = require('./models/user');
var { Todo } = require('./models/todo');

var app = express();

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
      res.status(404).send({ message : "Not found" });
    }
    res.status(200).send( {todo} );
  }, e => { res.status(400).send(e) } );

});

app.delete('/todos/:id',(req,res)=>{
  if( !ObjectID.isValid( req.params.id )){
    res.status(400).send({ message : "Invalid id" });
  }


  Todo.findByIdAndRemove( req.params.id ).then( todo=>{
    if( !todo )
      res.status(404).send({ message : "Not found" });
    res.status(200).send({todo});
  }, e =>{res.status(500).send(e)});


});


app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = { app };