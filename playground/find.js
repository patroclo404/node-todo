//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{

	if( err ){
		return console.log('unable to connect to mongo db');
	}
	console.log('Connected to Mongo DB server');

	db.collection('Todos').find({
		_id : new ObjectID('59f526b4965f39eec7010224')
	}).toArray().then((docs)=>{
		console.log('todos');
		console.log( JSON.stringify( docs , undefined, 2) );
	},(err)=>{
		console.log('Unable to fetch todos ', err );
	});



	//db.close();
});

