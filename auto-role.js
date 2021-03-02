const autoRoleSchema = require('./schemas/autorole-schema')
const { getAutoRoles } = require('./cache/caches/auto-role-cache')

module.exports = (client, autoRoleCache) => {
    client.on('guildMemberAdd', async (member) => {
        const guildId = member.guild.id
        const roles = await getAutoRoles(guildId)

        if (!roles)
            return;

        for (const role of roles) {
            if(member.guild.roles.cache.get(role) && !member.roles.cache.has(role))
            member.roles.add(role)
        }
    })
}