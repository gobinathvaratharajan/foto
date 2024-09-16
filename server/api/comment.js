const express = require('express');
const config = require('config');
const limiter = require('express-rate-limit');
const commentController = require('../controller/commentController');
const api = express.Router();

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));

api.post('/api/comment/:photo', use(commentController.create));

api.get('/api/comment/:photo', use(commentController.get));

api.delete('/api/comment/:id', use(commentController.delete));

module.exports = api;