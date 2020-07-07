const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    }
})

const modelName = 'Category';

module.exports = mongoose.model(modelName, CategorySchema)