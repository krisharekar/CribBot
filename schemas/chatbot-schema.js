const mongoose = require('mongoose')

const chatBotSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('chatBot', chatBotSchema, 'chatBot')