const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const itemInfoSchema = mongoose.Schema({
    guildId: reqString,
    itemInfos: [Object]
})

module.exports = mongoose.model('item-infos', itemInfoSchema)

/**
    {
        "name": <name>,
        "id": <id>,
        "value": <value>,
        "link": <link>
    },
 */