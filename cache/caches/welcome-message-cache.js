const welcomeMessageCache = new Map()
const welcomeSchema = require('../../schemas/welcome-schema')

module.exports.loadCache = async () => {
    const results = await welcomeSchema.find()

    for (const result of results) {
        if(result.welcomeMessage)
        welcomeMessageCache.set(result.guildId, result.welcomeMessage)
    }
}

module.exports.getWelcomeMessage = (guildId) => {
    return welcomeMessageCache.get(guildId)
}