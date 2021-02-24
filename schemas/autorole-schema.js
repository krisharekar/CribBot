const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const autoRoleSchema = mongoose.Schema({
    guildId: reqString,
    roles: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('auto-roles', autoRoleSchema)