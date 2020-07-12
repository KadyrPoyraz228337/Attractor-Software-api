const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const users = require('./routes/users')
const categories = require('./routes/categories')
const articles = require('./routes/articles')

const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const run = async () => {
    await mongoose.connect(config.database, config.databaseOptions);

    app.use('/users', users)
    app.use('/categories', categories)
    app.use('/articles', articles)

    app.listen(config.port)
};

run().catch(e => {
    console.error(e)
});