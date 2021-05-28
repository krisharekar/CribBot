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
    },
    dailyDonation: Number,
    weeklyDonation: Number,
    category: [Object]
})

module.exports = mongoose.model('donations', donationsSchema)

/**
 * {
 *     category: [{
 *               name: '1y',
 *               donationAmount: 100000
 *             }]
 * }
 */