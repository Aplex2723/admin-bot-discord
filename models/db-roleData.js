const { model, Schema } = require('mongoose')

const modelSchema = Schema({ 
    server_id: {
        type: String,
        required: true,
    },
    role_id: {
        type: String,
    }
})

module.exports = model('MuteRole', modelSchema, 'MuteRole')