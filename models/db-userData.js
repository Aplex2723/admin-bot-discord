const { model, Schema } = require('mongoose')

const modelSchema = Schema({

    channelId: {
        type: String,
        required: [true, 'The channelID is required']
    },

    user_id: {
        type: String,
        required: [true, 'The ID is required']
    },

    roles: [{
        type: String
    }],

})

module.exports = model('Data', modelSchema, 'Data')