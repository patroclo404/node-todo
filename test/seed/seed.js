const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user');


const todos = [
  {_id: new ObjectID(), text : 'first tet' },
  {_id: new ObjectID(), text : 'second tet' }
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email : 'a@mail.com',
    password : '12345678',
    tokens : [{
      access : 'auth',
      token : jwt.sign({_id: userOneId, access : 'auth'},'abc123').toString()
    }]
  },
  {
    _id: userTwoId,
    email : 'b@mail.com',
    password : '87654321'
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
};

const populateUsers = (done) => {
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(()=>done());
};

module.exports = {todos,populateTodos,populateUsers,users};