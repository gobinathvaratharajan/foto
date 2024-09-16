const photo = require('../model/photo');
const utility = require('../model/utilities');

exports.create = async function (req, res) {
    const data = req.body;
    utility.validate(data, ['text']);

    const photoData = await photo.create({ text: data.text, description: data.description}, data.user, data.account);
    return res.status(200).send({ message: 'Photo saved', data: photoData });
}

exports.get = async function (req, res) {
    console.log('photos ID:', req.params.id)
    utility.assert(req.params.id, 'Please provide the photo id');

    const photoData = await photo.get(req.params.id);
    return res.status(200).send({ data: photoData })
}

exports.like = async function (req, res) {
    const data = req.body;
    utility.assert(req.params.id, 'Please provide the photo id');

    const photoData = await photo.get(req.params.id);
    utility.assert(photoData.length, 'No photo exists with the id');
    photo.like(req.params.id, data.user);
    return res.status(200).send({ message: 'Liked' })
}

exports.update = async function (req, res) {
    const data = req.body;
    utility.assert(req.params.id, 'Please provide the photo id');
    await photo.update(req.params.id, data, data.user, data.account);
    return res.status(200).send({ message: 'Photo updated', data: data })
}

exports.delete = async function (req, res) {
    const data = req.body;
    utility.assert(req.params.id, 'Please provide the photo id');
    const photoData = await photo.get(req.params.id, data.user, data.account);
    utility.assert(photoData.length, 'No photo exists with the id');

    await photo.delete(req.params.id, data.user, data.account)
    return res.status(200).send({ message: 'Photo deleted' })
}