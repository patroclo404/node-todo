var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://root:root@ds257485.mlab.com:57485/todoappnode');
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};