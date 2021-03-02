const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const blacklistSchema = mongoose.Schema({
    guildId: reqString,
    users: [String]
})

module.exports = mongoose.model('blacklists', blacklistSchema)