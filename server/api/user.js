const express = require('express');
const config = require('config');
const limiter = require('express-rate-limit');
const throttle = config.get('throttle');
const userController = require('../controller/userController');
const api = express.Router();

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));

api.post('/api/user', limiter(throttle.sign_up), use(userController.create));

api.get('/api/user', use(userController.like));

api.get('/api/user/public/:username', use(userController.public));

api.get('/api/user/account', use(userController.account));

api.patch('/api/user', use(userController.update));

api.delete('/api/user', use(userController.delete));

module.exports = api;