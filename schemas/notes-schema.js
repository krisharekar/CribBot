const mongoose = require('mongoose')

const notesSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    notes: {
        type: [Object]
    }
})