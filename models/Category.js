const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    title: {
        type: String,
        required: true,
        unique: true
    }
})

const modelName = 'Category';

module.exports = mongoose.model(modelName, CategorySchema)