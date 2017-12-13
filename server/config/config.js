let env = process.env.NODE_ENV || 'development';

if( env === 'development' || env === 'test' || env === 'production' ){
  let config = require('./config.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach( (key) => {
    process.env[key] = envConfig[key];
  });

}

// if( env === 'development' ){
//   process.env.PORT = 3000;
// }else if( env === 'test' ){
//   process.env.PORT = 3000;
// }


// if( env === 'development' ){
//   mongoose.connect('mongodb://localhost:27017/TodoApp');
// }else if( env === 'test' ){
//   mongoose.connect('mongodb://localhost:27017/TodoAppTest');
// }else if ( env === 'production'){
//   mongoose.connect('mongodb://root:root@ds257485.mlab.com:57485/todoappnode');
// }
console.log(env);