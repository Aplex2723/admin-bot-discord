const { model, Schema } = require('mongoose')
const moment = require('moment')

const modelSchema = Schema({

    server_id: {
        type: String,
        required: [true, 'The server ID is required']
    },

    user_id: {
        type: String,
        required: [true, 'The ID is required']
    },

    roles: [{
        type: String
    }],

    reason: {
        type: String,
        default: "No reason"
    },

    command: {
        type: String,
        required: [true, 'The command type is required']
    },

    date: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    },


})

module.exports = model('SanctionsData', modelSchema, 'SanctionsData')