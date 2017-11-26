var mongoose = require('mongoose');
let env = process.env.NODE_ENV || 'development';
mongoose.Promise = global.Promise;

if( env === 'development' ){
  mongoose.connect('mongodb://localhost:27017/TodoApp');
}else if( env === 'test' ){
  mongoose.connect('mongodb://localhost:27017/TodoAppTest');
}else if ( env === 'production'){
  mongoose.connect('mongodb://root:root@ds257485.mlab.com:57485/todoappnode');
}
console.log(env);

module.exports = {mongoose};