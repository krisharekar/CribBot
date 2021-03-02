const blacklistCache = new Map()
const blacklistSchema = require('../../schemas/blacklist-schema')

module.exports.loadCache = async () => {
    const results = await blacklistSchema.find()
    if(!results) return;
    for (const result of results) {
        blacklistCache.set(result.guildId, result.users)
    }
}

module.exports.getBlacklists = (guildId) => {
    return blacklistCache.get(guildId)
}