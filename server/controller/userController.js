const user = require('../model/user');
const utility = require('../model/utilities');

exports.create = async function (req, res) {
    const data = req.body;
    utility.validate(data, ['email', 'username', 'password']);

    // create the user and assign them to account
    const userData = await user.create(data, data.account_id);
    await user.account.add(userData.id, data.account_id, { permission: 'user', username: data.username });

    return res.status(200).send({ message: 'user created' })
}

exports.get = async function (req, res) {
    const data = req.body;
    utility.validate(data, ['user']);

    const userData = await user.get(data.user, null, data.account);
    userData.accounts = await user.account(userData.id);

    return res.status(200).send({ data: userData })
}

exports.public = async function (req, res) {
    utility.assert(req.params.username, 'Please provide a username');
    const userData = await user.public(req.params.username);

    return res.status(200).send({ data: userData })
}

exports.account = async function (req, res) {
    const data = req.body;
    utility.validate(data, ['user']);
    const userData = await user.account(req.user);

    return res.status(200).send({ data: userData })
}

exports.update = async function (req, res) {
    const data = req.body;
    utility.validate(data);

    const userData = await user.get(data.user, null, data.account);
    utility.assert(userData, 'User does not exist');

    // update the user
    await user.update(userData.id, data.account, { last_active: data.last_active });
    return res.status(200).send({ message: 'Profile update', data: data })
}

exports.delete = async function (req, res) {
    const data = req.body;
    const id = data.id || req.user;
    utility.assert(id, 'User id required');

    const userData = await user.get(id, null, data.account);
    utility.assert(userData, 'User does not exist');

    await user.delete(userData.id, data.account);
    await user.account.delete(userData.id, data.account);
    return res.status(200).send({ message: 'User deleted' })
}