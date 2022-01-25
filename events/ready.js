const mongoose = require('mongoose');

module.exports = async (client) => {

    try {

        await mongoose.connect( client.config.mongoURI, { keepAlive: true })
        console.log('Connection to database established')
        
    } catch (error) {

        console.log(error)
        throw new Error(`Connection to database failed`)
        
    }

    console.log('\nBot is online with id ' + client.user.id);
};