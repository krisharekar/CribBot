const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const countingSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    count: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('counting-schema', countingSchema)