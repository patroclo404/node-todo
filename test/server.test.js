const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {populateTodos,todos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{

    var text = "test todo text";

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(201)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if( err ){
          return done(err);
        }
        Todo.find({text}).then(todos=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e=>done(e));
      });
  });

  it('should not create todo with invalid data',done=>{

    var text = "";

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(400)
    .end( (err,res) => {
      if( err ){
        return done(err);
      }

      Todo.find().then(todos=>{
        expect(todos.length).toBe(2);
        done();
      }).catch(e=>done(e));
    })
  });
});

describe('PATCH /todos',()=>{
  it('should update at todo completed field to true ',(done)=>{

    let jsonToSend = {
      completed : true
    }

    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .send(jsonToSend)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done);
  });

  it('should update at todo text fiel to "text from unit test"',(done)=>{
    let jsonToSend2 = {
      completed : true,
      text : 'text from unit test'
    }
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .send(jsonToSend2)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(jsonToSend2.text);
    })
    .end(done);
  });
});

describe('GET /todos',()=>{
  it('should get all todos',done=>{
    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect(res=>{
        expect(res.body.todos.length).toBe(2);
        expect( todos.length ).toBe(2);
      })
      .end((err,res)=>{
        if(err)
          return done(err);
        Todo.find().then(todos=>{
          expect(todos.length).toBe(2);
          done();
        }).catch(e=>done(e));
      })
  });

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 400 for invalid id', (done) => {
    request(app)
      .get(`/todos/${123}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });

  it('should return 404 not found', (done) => {
    request(app)
      .get(`/todos/${ new ObjectID().toHexString() }`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todo',()=>{
  it('should delete one todo',done=>{
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err,res)=>{
        if( err ) return done(err);

        Todo.findById( todos[0]._id ).then( todo=>{
          expect(todo).toBe(null);
          done();
        }).catch(e=>done(e));

      });
  });
});

describe('GET user/me',()=>{
  it('shoul get a user if authenticated ',(done)=>{
    request(app)
      .get(`/user/me`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.email).toBe('a@mail.com');
      })
      .end(done);
  });
  it('soul get a 401 user if not authenticated ',(done)=>{
    request(app)
      .get(`/user/me`)
      .expect(500)
      .end(done);
  });
});

describe('POST /user',()=>{
  it('should create a new user',(done)=>{

    var user = {
      email : 'c@mail.com',
      password : '1234abs' 
    };

    request(app)
      .post('/user')
      .send(user)
      .expect(201)
      .expect((res)=>{
        expect(res.body.email).toBe(user.email);
      })
      .end((err,res)=>{
        if( err ){
          return done(err);
        }
        done();
      });
  });

  it('should not create user',done=>{
    var user = {
    };

    request(app)
      .post('/user')
      .send(user)
      .expect(400)
      .end(done());
  });
});

describe('POST /user/login',()=>{
  it('should login user with valid data',(done)=>{

    var user = {
      email : 'a@mail.com',
      password : '12345678' 
    };
    request(app)
      .post('/user/login')
      .send(user)
      .expect(200)
      .expect((res)=>{
        expect(res.body.email).toBe(user.email);
        expect(res.body._id).toBe(`${users[0]._id}`);
      })
      .end((err,res)=>{
        if( err ){
          return done(err);
        }
        done();
      });
  });
  it('should not login user with invalid data',(done)=>{
    
        var user = {
          email : 'a@mail.com',
          password : '123456789' 
        };
        request(app)
          .post('/user/login')
          .send(user)
          .expect(400)
          .end(done());
      });
});

// describe('DELETE /user/me/token', () => {
//   it('should remove auth token on logout', (done) => {
//     request(app)
//       .delete('/user/me/token')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         User.findById(users[0]._id).then((user) => {
//           expect(user.tokens.length).toBe(0);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });