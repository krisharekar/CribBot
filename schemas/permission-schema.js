const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const permissionSchema = mongoose.Schema({
    guildId: reqString,
    permissions: {
        type: [Object]
    }
})

module.exports = mongoose.model('permissions', permissionSchema)

/**
 * {
 *     enitity: <id>
 *     permission: <allow/deny>
 *     commandName: <command>
 * }
 */