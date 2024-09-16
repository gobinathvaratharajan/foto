const db = require('./knex')();
const Cryptr = require('cryptr');
const crypto = new Cryptr(process.env.CRYPTO_SECRET);
const { v4: uuidv4 } = require('uuid');

exports.save = async function (data, user) {
    if (data.access) data.access = crypto.encrypt(data.access);

    if (data.refresh) data.refresh = crypto.encrypt(data.refresh);

    // if token already exists?
    const tokenData = await db('token').select('*').where({ user_id: user });

    if(tokenData) {
        await db('token')
            .update(data)
            .where({ id: tokenData[0].id, user_id: user });
    } else {
        data.user_id = user;
        data.id = uuidv4();
        await db('token').insert(data);
    }
    return data;
}

exports.verify = async function (user) {
    const data = await data('token').select('id').where({ user_id: user });
    return data.length ? true : false;
}

exports.delete = async function (id, user) {
    return user ? await db('token').del().where({
        user_id: user,
        ...id && { id: id }
    }) : false
}