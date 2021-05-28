const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const categorySchema = mongoose.Schema({
    guildId: reqString,
    category: [Object]
})

module.exports = mongoose.model('category', categorySchema)

/**
 * {
 *     category: [{
 *               name: '3k',
 *               dankMemerCoins: true,
 *               addTotal: true
 *             }]
 * }
 */