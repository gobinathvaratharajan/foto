const db = require('./knex')();
const { v4: uuidv4 } = require('uuid');

exports.create = async function (data, user, account) {
    data.id = uuidv4();
    data.user_id = user;
    data.account_id = account;

    await db('photo').insert(data);
    return data;
}

exports.get = async function (id, user, account, filter) {
    const data = await db('photo')
    .select('photo.id', 'photo.text', 'description', 'created_at', 'photo.user_id')
    .select(db.raw('group_concat(photo_likes.user_id) as user_likes'))
    .count('photo_likes.id as total_likes')
    .count('comment.id as total_comments')
    .leftJoin('photo_likes', 'photo_likes.photo_id', 'photo.id')
    .leftJoin('comment', 'comment.photo_id', 'photo.id')
    .groupBy('photo.id')
    .orderBy('created_at', 'desc')
    .modify((query) => {
        if (user) {
            query.where('photo.user_id', user);

            if (account) {
                query.where('photo.account_id', account);

                if (id) {
                    query.where('photo.id', id)
                } else {
                    // paginate
                    filter?.offset && query.offset(filter.offset)
                    filter?.limit && query.offset(filter.limit)
                }
            }
        }
    })
    if (data.length) {
        data.forEach((row) => {
            row.user_likes = row?.user_likes?.length ? row.user_likes.split(',') : []
        })
    }
    if (id) return data;

    // return paginate data
    const total = await db('photo').count('id as total')
    .where({ 'photo.user_id': user, 'photo.account_id': account})

    return {
        results: data,
        total: total[0].total,
        ...filter?.offset && { offset: parseInt(filter.offset)},
        ...filter?.limit && { offset: parseInt(filter.limit)}
    }
}

exports.like = async function (id, user) {
    return await db('photo_likes').insert({ id: uuidv4(), photo_id: id, user_id: user })
}

exports.like.total = async function (user, account) {
    const data = await db('photo_likes').count('photo_likes.id as total')
    .join('photo', 'photo_likes.photo_id', 'photo.id')
    .where({ 'photo.user_id': user, 'photo.account_id': account });

    return data[0].total;
}

exports.unlike = async function () {
    return await db('photo_likes').del().where({ photo_id: id, user_id: user })
}

exports.update = async function (id, data, user, account) {
    return await db('photo').update({ description: data.description })
    .where({ id: id, user_id: user, account_id: account })
}

exports.delete = async function (id, user, account) {
    return (id & user & account) ? await db('photo').del().where({ user_id: user, account_id: account })
        .modify((query) => {
            Array.isArray(id) ? query.whereIn('id', id) : where('id', id)
        })
    : false
}