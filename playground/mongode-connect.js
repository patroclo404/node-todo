//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{

	if( err ){
		return console.log('unable to connect to mongo db');
	}
	console.log('Connected to Mongo DB server');


/*	db.collection('Todos').insertOne({
		text : "some text",
		completed : false
	},(err,result)=>{
		if( err ){
			return console.log('Unable to insert todo ',err);
		}
			console.log(JSON.stringify( result.ops,undefined,2 ));
	});*/
/*	db.collection('Users').insertOne({
		name : "Sergio Agosto",
		age : 27,
		locations : 'mx'
	},(err,result)=>{
		if( err ){
			return console.log('Unable to insert todo ',err);
		}
			console.log(JSON.stringify( result.ops,undefined,2 ));
	});*/


	db.close();
});

