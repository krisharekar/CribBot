const mongoose = require('mongoose')

const levelSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('levels', levelSchema)