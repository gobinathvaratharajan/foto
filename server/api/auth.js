const express = require('express');
const config = require('config');
const limiter = require('express-rate-limit');
const throttle = config.get('throttle');
const auth = require('../model/auth');
const authController = require('../controller/authController');
const api = express.Router();

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));

api.post('/api/auth', limiter(throttle.sign_in), use(authController.signin));

module.exports = api;  