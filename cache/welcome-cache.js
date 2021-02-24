const welcomeCache = new Map()
const welcomeSchema = require('../schemas/welcome-schema')

module.exports.loadWelcomeData = async () => {
    const results = await welcomeSchema.find()

    for (const result of results) {
        welcomeCache.set(result.guildId, result.channelId)
    }
}

module.exports.getChannelId = (guildId) => {
    return welcomeCache.get(guildId)
}