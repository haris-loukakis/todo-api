require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Καθαρισμός της βάσης πριν από κάθε test
beforeEach(async () => {
  await User.deleteMany({});
});

// Κλείσιμο σύνδεσης στο τέλος
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {

  // Test 1: Signup
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  // Test 2: Login
  it('should login an existing user', async () => {
    // 1. Φτιάχνουμε έναν χρήστη
    await User.create({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123'
    });

    // 2. Προσπαθούμε να συνδεθούμε
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  //Test 3: Logout
  it('should logout the user', async () => {
    const res = await request(app).get('/auth/logout');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({});
  });

});