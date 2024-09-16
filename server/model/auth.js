const jwt = require("jsonwebtoken");
const config = require("config");
const permissions = config.get('permissions');
const setting = config.get('token');
const utility = require("./utilities");

// Generate JWT
exports.token = function (data, secret, duration) {
    return jwt.sign(data, secret || process.env.TOKEN_SECRET, { expiresIn: duration || setting.duration });
}

// Verify the JWT
exports.token.verify = function (token, secret) {
    return jwt.verify(token, secret || process.env.TOKEN_SECRET);
}

// middleware for verification
exports.verify = function (permission, scope) {
    return async function(req, res, next) {
        try {
            const header = req.headers['authorization'];
            if (!header) {
                if (permission === 'public') {
                    return next(); // call the controller
                } else {
                    throw { message: "No authorization header provider"}
                }
                }
            // Processing th header
            console.log(req);
            const type = header.split(' ')[0];
            const token = header.split(' ')[1];
            if (type === 'Basic') {
                // apiKey
            } else if (type === 'Bearer') {
                // jwt token verification
                const decode = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decode.accountId && decode.userId && decode.permission) {
                    if (permission === 'public' || permissions[decode.permission][permission]) {
                        // auth -> owner -> owner we are accessing this owner above
                        req.account = decode.accountId;
                        req.user = decode.userId;
                        req.permission = decode.permission;
                        next(); // interactive with the controller
                    } else {
                        throw new Error()
                    }
                } else {
                    throw { message: 'Invalid token' }
                }
            } else {
                throw { message: "Unrecognised header type" }
            }
        } catch (err) {
            res.status(401).send({ message: err.message || 'You do not have permission to perform this action.' })
        }
    }
}

/*
    Token is pass with Bearer
    apiKey is pass as a query param or in headers
*/