const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const welcomeSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    welcomeMessage: String
})

module.exports = mongoose.model('welcome-message', welcomeSchema, 'welcome-message')