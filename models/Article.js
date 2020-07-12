const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: function () {
            return !this.image
        }
    },
    image: {
        type: String,
        required: function () {
            return !this.title
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const modelName = 'Article';

module.exports = mongoose.model(modelName, ArticleSchema)