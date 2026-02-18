require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Todo = require('../src/models/Todo');

// Καθαρισμός της βάσης πριν από κάθε test
beforeEach(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
});

// Κλείσιμο σύνδεσης στο τέλος
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Todo Endpoints', () => {
  
  // Test: Δημιουργία Todo
  it('should create a new todo for logged in user', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Todo User', email: 'todo@example.com', password: 'password123'
    });
    const token = userRes.body.token;

    const res = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Learn TDD with Express' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('title', 'Learn TDD with Express');
  });

  // Test: Προβολή Λίστας (GET All)
  it('should get all todos for the logged in user', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'List User', email: 'list@example.com', password: 'password123'
    });
    const token = userRes.body.token;
    const userId = userRes.body.user.id;

    await Todo.create([
      { title: 'Todo 1', user: userId },
      { title: 'Todo 2', user: userId }
    ]);

    const res = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.count).toEqual(2);
  });

  // Test: Προβολή ενός (GET One)
  it('should get a single todo by id', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Single User', email: 'single@example.com', password: 'password123'
    });
    const token = userRes.body.token;
    const todo = await Todo.create({ title: 'Find Me', user: userRes.body.user.id });

    const res = await request(app)
      .get(`/todos/${todo._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.title).toBe('Find Me');
  });

  // Test: Ενημέρωση Todo (PUT)
  it('should update a todo', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Update User', email: 'update@example.com', password: 'password123'
    });
    const token = userRes.body.token;
    const todo = await Todo.create({ title: 'Old Title', user: userRes.body.user.id });

    const res = await request(app)
      .put(`/todos/${todo._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title', completed: true });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.title).toBe('New Title');
    expect(res.body.data.completed).toBe(true);
  });

  // Test: Διαγραφή Todo (DELETE)
  it('should delete a todo', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Delete User', email: 'delete@example.com', password: 'password123'
    });
    const token = userRes.body.token;
    const todo = await Todo.create({ title: 'Delete Me', user: userRes.body.user.id });

    const res = await request(app)
      .delete(`/todos/${todo._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    const foundTodo = await Todo.findById(todo._id);
    expect(foundTodo).toBeNull();
  });

  // Test: Προσθήκη Item σε Todo
  it('should add an item to a todo', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Item User', email: 'item@example.com', password: 'password123'
    });
    const token = userRes.body.token;
    const todo = await Todo.create({ title: 'Shopping List', user: userRes.body.user.id });

    const res = await request(app)
      .post(`/todos/${todo._id}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Buy Milk' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].text).toBe('Buy Milk');
  });

  //Test: Ενημέρωση Item 
  it('should update a todo item', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Item Upd User', email: 'itemupd@example.com', password: 'password123'
    });
    const token = userRes.body.token;

    // Φτιάχνουμε Todo και βάζουμε ένα Item μέσα
    const todo = await Todo.create({ title: 'Work', user: userRes.body.user.id });
    todo.items.push({ text: 'Email Boss' });
    await todo.save();
    const itemId = todo.items[0]._id;

    // Κάνουμε Update το Item
    const res = await request(app)
      .put(`/todos/${todo._id}/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        completed: true,
        text: 'Email Boss ASAP'
      });

    expect(res.statusCode).toEqual(200);
    const updatedItem = res.body.data.items.find(i => i._id.toString() === itemId.toString());
    expect(updatedItem.completed).toBe(true);
    expect(updatedItem.text).toBe('Email Boss ASAP');
  });

  //Test: Διαγραφή Item 
  it('should delete a todo item', async () => {
    const userRes = await request(app).post('/signup').send({
      name: 'Item Del User', email: 'itemdel@example.com', password: 'password123'
    });
    const token = userRes.body.token;

    const todo = await Todo.create({ title: 'Chores', user: userRes.body.user.id });
    todo.items.push({ text: 'Wash Dishes' });
    await todo.save();
    const itemId = todo.items[0]._id;

    // Σβήνουμε το Item
    const res = await request(app)
      .delete(`/todos/${todo._id}/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.items).toHaveLength(0); // Πρέπει να είναι άδειο
  });

});