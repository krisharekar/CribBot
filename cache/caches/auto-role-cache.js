const autoRoleCache = new Map()
const autoRoleSchema = require('../../z-archived/schemas/autorole-schema')

module.exports.loadCache = async () => {
    const results = await autoRoleSchema.find()
    if(!results) return;
    for (const result of results) {
        autoRoleCache.set(result.guildId, result.roles)
    }
}

module.exports.getAutoRoles = (guildId) => {
    return autoRoleCache.get(guildId)
}