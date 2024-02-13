const express = require('express');
const authMiddleware = require('./auth/middleware/authMiddleware');
const server = express();

server.get('/test', (_req, res) => {
  res.end('HEllo');
});

  module.exports = server;