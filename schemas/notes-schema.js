const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const notesSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    totalNotes: {
        type: Number,
        required: true
    },
    notes: {
        type: [Object]
    }
})

module.exports = mongoose.model('notes', notesSchema)