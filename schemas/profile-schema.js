const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
        guildId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        coins: {
            type: Number,
            required: true
        }
})

module.exports = mongoose.model('profiles', profileSchema)