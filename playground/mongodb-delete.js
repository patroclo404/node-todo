
const {MongoClient,ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{

	if( err ){
		return console.log('unable to connect to mongo db');
	}
	console.log('Connected to Mongo DB server');

	//delete many

	/*db.collection('Todos')
		.deleteMany({ text : 'Eat lunch' })
		.then( result =>{
			console.log(result);
		});*/

		/*db.collection('Users')
		.deleteMany({ name : 'Sergio Agosto' })
		.then( result =>{
			console.log(result);
		});*/

	//delete one

	//delete one

	/*db.collection('Todos')
		.deleteOne({ text : 'Eat lunch' })
		.then( result => {
			console.log(result);
		});*/

	//find and delete

	/*db.collection('Todos')
		.findOneAndDelete({ text : 'Eat lunch' })
		.then( result => {
			console.log(result);
		});*/

	db.collection('Users')
		.findOneAndDelete({_id : new ObjectID('59f9487e700fbb168abd9d35')})
		.then( result => {
			console.log(result);
		});



	//db.close();
});

