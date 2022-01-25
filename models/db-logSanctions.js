const { model, Schema } = require('mongoose')
const moment = require("moment")

const modelSchema = Schema({
    server_id: {
        type: String,
        required: [true, "The server id is required"]
    },

    user_id: {
        type: String,
        required: [true, "The uesr id is required"]
    },

    user_name: {
        type: String,
        default: "System"
    },

    command: {
        type: String,
        required: [true, "Command is required"]
    },

    reason: {
        type: String,
        default: "No reason"
    },

    made_by: {
        type: String,
        required: [true, "User who performed it required"]
    },

    date: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    },

})

module.exports = model("Log", modelSchema)