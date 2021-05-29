const { getPrefix } = require('../cache/caches/prefix-cache')

module.exports.prefixFinder = (guildId) => {
    const config = require('../config.json')
    const guildPrefix = getPrefix(guildId)

    if (!guildPrefix)
        return config.prefix

    return guildPrefix
}