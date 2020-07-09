const mongoose = require('mongoose');
const config = require("./config");

const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.database, config.databaseOptions);

    const collection = await mongoose.connection.db.listCollections().toArray();

    for (let coll of collection) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [valera, alex, john] = await User.create({
        username: 'valera',
        password: '123',
        token: '123'
    },{
        username: 'alex',
        password: '123',
        role: 'admin',
        token: '123'
    },{
        username: 'john',
        password: '123',
        token: '123'
    })

    mongoose.connection.close();
};

run().catch(e => {
    throw e;
});