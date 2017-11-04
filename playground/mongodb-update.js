
const {MongoClient,ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{

	if( err ){
		return console.log('unable to connect to mongo db');
	}
	console.log('Connected to Mongo DB server');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id : new ObjectID("59f5111ded601c1708f4882d")
	// },{
	// 	$set : {
	// 		completed : true
	// 	}
	// },{
	// 	returnOriginal : false
	// }).then(result =>{
	// 	console.log( result );
	// })

	db.collection('Users').findOneAndUpdate({
		_id : new ObjectID("59f948709fa4ad166b1dd666")
	},{
		$set : {
			name : "Gael Chipoti"
		},
		$inc : {
			age : -2
		}
	},{
		returnOriginal : false
	}).then(result =>{
		console.log( result );
	})
	
});

