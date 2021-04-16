const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const donationRolesSchema = mongoose.Schema({
    guildId: reqString,
    donationRoles: [Object] 
})

module.exports = mongoose.model('donation-roles', donationRolesSchema)

/**
 * {
 *     roleId: <id>
 *     donationAmount: <amount>    
 * }
 */