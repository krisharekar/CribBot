const autoRoleCache = new Map()
const autoRoleSchema = require('../schemas/autorole-schema')

module.exports.loadAutoRoleData = async () => {
    const results = await autoRoleSchema.find()
    if(!results) return;
    for (const result of results) {
        autoRoleCache.set(result.guildId, result.roles)
    }
}

module.exports.getAutoRoles = (guildId) => {
    return autoRoleCache.get(guildId)
}