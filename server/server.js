require('dotenv').config();
const express = require('express');
const PORT = process.env.port || 8080;
const app = express();
const config = require('config');
const api = require('./api');
const throttle = config.get('throttle');
const limiter = require('express-rate-limit');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); // rate limit proxy

app.use('/api/', limiter(throttle.api));
app.use(api);

app.use(function (err, req, res, next) {
    const message = err.raw?.message || err.message || err.sqlMessage || null;
    console.error(err);
    return res.status(500).send({ message: message })
})

const server = app.listen(PORT, () => {
	console.log('server started');
});
