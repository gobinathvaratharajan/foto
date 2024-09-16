const auth = require('../model/auth');
const account = require('../model/account');
const user = require('../model/user');
const token = require('../model/token');
const utility = require('../model/utilities');

exports.signin = async function (req, res, next) {
    const data = req.body;
    utility.validate(data, ['email', 'password']);

    const userData = await user.get(null, data.email);
    utility.assert(userData, 'Please enter the correct login details');

    const verified = await user.password.verify(userData.id, userData.account_id, data.password);
    utility.assert(verified, 'Please enter the correct login details', 'password');
    console.log(verified);
    return authenticate();
}

async function authenticate(req, res, userData, data) {
    const accountData = await account.get(userData.account_id);
    const userAccount = await user.account(userData.id);

    console.log(accountData, userAccount);
    const jwt = auth.token({
        accountId: userData.account_id,
        userId: userData.id,
        permission: userData.permission
    })

    return res.status(200).send({
        token: jwt
    })
}