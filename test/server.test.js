const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');

const todos = [
  {_id: new ObjectID(), text : 'first tet' },
  {_id: new ObjectID(), text : 'second tet' }
];

beforeEach(done=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{

    var text = "test todo text";

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 400 for invalid id', (done) => {
    request(app)
      .get(`/todos/${123}`)
      .expect(400)
      .end(done);
  });

  it('should return 404 not found', (done) => {
    request(app)
      .get(`/todos/${ new ObjectID().toHexString() }`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todo',()=>{
  it('should delete one todo',done=>{
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
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
