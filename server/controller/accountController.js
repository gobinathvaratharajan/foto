const account = require('../model/account');
const user = require('../model/user');
const utility = require('../model/utilities');

exports.create = async function (req, res) {
    const data = req.body;
    utility.validate(data, ['email', 'username', 'password']);

    // create an account
    console.log('created acc', data);
    const accountData = await account.create(data.plan);
    const userData = await user.create(data, accountData.data);
    await user.account.add(userData.id, accountData.id, { permission: 'owner', username: data.username })
    return res.status(200).send({ data: accountData })
}

exports.get = async function (req, res) {
    const data = await account.get(req.account);
    return res.status(200).send({ data: data })
}

exports.close = async function (req, res) {
    // check the account exist
    const data = req.body;
    const accountData = await account.get(data.account);
    utility.assert(accountData, 'Account does not exist');

    await account.delete(accountData.id);
    return res.status(200).send({ message: 'Account close' })
}