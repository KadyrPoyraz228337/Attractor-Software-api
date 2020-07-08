const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: String
})

const modelName = 'Article';

module.exports = mongoose.model(modelName, ArticleSchema)