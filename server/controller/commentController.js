const comment = require('../model/comment');
const utility = require('../model/utilities');

exports.create = async function (req, res) {
    const data = req.body;
    utility.validate(data, ['text']);

    const photoId = req.params.photo; // Ensure this matches your route parameter name
    if (!photoId) {
        return res.status(400).send({ message: 'Photo ID is required' });
    }

    // create an account
    const commentData = await comment.create(photoId, { text: data.text }, data.user, data.account);
    return res.status(200).send({ data: commentData })
}

exports.get = async function (req, res) {
    utility.assert(req.params.photo, 'Please provide the photo id');

    const commentData = await comment.get(null, req.params.photo);
    return res.status(200).send({ data: commentData })
}

exports.delete = async function (req, res) {
    const data = req.body;
    utility.assert(req.params.id, 'Please provide the comment id');

    await comment.delete(req.params.id, data.user)
    return res.status(200).send({ message: 'Comment deleted' })
}