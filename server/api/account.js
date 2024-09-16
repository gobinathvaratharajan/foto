const express = require('express');
const config = require('config');
const limiter = require('express-rate-limit');
const throttle = config.get('throttle');
const auth = require('../model/auth');
const accountController = require('../controller/accountController');
const api = express.Router();

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));

api.post('/api/account', limiter(throttle.sign_up), use(accountController.create));

api.get('/api/account', auth.verify('owner'), use(accountController.get));

api.delete('/api/account', use(accountController.delete));

module.exports = api;