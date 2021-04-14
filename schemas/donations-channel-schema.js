const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const donationsChannelSchema = mongoose.Schema({
    guildId: reqString,
    donationsChannelIds: [String],
    highestDonorChannelId: String
})

module.exports = mongoose.model('donation-channels', donationsChannelSchema)