const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const urlShortener = new Schema({
    mainUrl: {
        type: 'String',
        required: true,
    },
    shortUrl: String,
    clicks: {
        type: Number,
        default: 0 // default value for clicks field
    },
    urlToken: String,
});

module.exports = mongoose.model('URL', urlShortener);