const prefixCache = new Map()
const prefixSchema = require('../../schemas/prefix-schema')

module.exports.loadCache = async () => {
    const results = await prefixSchema.find()

    for (const result of results) {
        prefixCache.set(result.guildId, result.prefix)
    }
}

module.exports.getPrefix = (guildId) => {
    return prefixCache.get(guildId)
}