const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const donationsChannelSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString
})

module.exports = mongoose.model('donation-channels', donationsChannelSchema)