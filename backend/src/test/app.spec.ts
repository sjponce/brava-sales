const request = require('supertest');
const express = require('express');

describe('GET /', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get("/", (req, res) => {
      res.send("Brava sales!!!");
    });
  });

  test('should return the correct response on the root URL', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe("Brava sales!!");
  });
});