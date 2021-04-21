const itemInfoCache = new Map()
const itemInfoSchema = require('../../schemas/item-info-schema')

module.exports.loadCache = async (guildId) => {

    if (guildId) {
        const result = await itemInfoSchema.findOne({ guildId })
        if (!result) return;
        itemInfoCache.set(result.guildId, result.itemInfos)
        // console.log(itemInfoCache)
        return;
    }

    const results = await itemInfoSchema.find()
    if (!results) return;
    for (const result of results) {
        itemInfoCache.set(result.guildId, result.itemInfos)
    }
    // console.log(itemInfoCache)
}

module.exports.getItemInfos = (guildId) => {
    return itemInfoCache.get(guildId)
}