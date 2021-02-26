const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const donationsSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    donationAmount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('donations', donationsSchema)