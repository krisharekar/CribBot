const permissionsCache = new Map()
const permissionSchema = require('../../schemas/permission-schema')

module.exports.loadCache = async () => {
    const results = await permissionSchema.find()
    if(!results) return;
    for (const result of results) {
        permissionsCache.set(result.guildId, result.permissions)
    }
}

module.exports.getPermissions = (guildId) => {
    return permissionsCache.get(guildId)
}