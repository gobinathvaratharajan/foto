const express = require('express');
const config = require('config');
const limiter = require('express-rate-limit');
const photoController = require('../controller/photoController');
const api = express.Router();

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));

api.post('/api/photo', use(photoController.create));

api.get('/api/photo/like/:id', use(photoController.like));

api.get('/api/photo/:id', use(photoController.get));

api.patch('/api/photo/:id', use(photoController.update));

api.delete('/api/photo/:id', use(photoController.delete));

module.exports = api;