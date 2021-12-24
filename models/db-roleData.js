const { model, Schema } = require('mongoose')

const modelSchema = Schema({ 
    channelId: {
        type: String,
        required: true,
    },
    role_id: {
        type: String,
    }
})

module.exports = model('MuteRole', modelSchema, 'MuteRole')