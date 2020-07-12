const mongoose = require('mongoose');
const config = require("./config");

const User = require('./models/User');
const Category = require('./models/Category')
const Article = require('./models/Article')

const run = async () => {
    await mongoose.connect(config.database, config.databaseOptions);

    const collection = await mongoose.connection.db.listCollections().toArray();

    for (let coll of collection) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [valera] = await User.create({
        username: 'valera',
        password: '123',
        token: '123'
    }, {
        username: 'alex',
        password: '123',
        role: 'admin',
        token: '123'
    }, {
        username: 'john',
        password: '123',
        token: '123'
    })

    const [news] = await Category.create({
        title: 'News'
    }, {
        title: 'Recipes'
    }, {
        title: 'Games'
    })

    await Article.create({
        user: valera,
        category: news,
        title: 'Some title',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    })

    mongoose.connection.close();
};

run().catch(e => {
    throw e;
});