const Discord = require('discord.js')
const permissionSchema = require('../../schemas/permission-schema')
const { loadCache } = require('../../cache/caches/permissions-cache')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['permissions', 'perms'],
    description: 'Lists the server permissions',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args, client) {
        const guildId = message.guild.id

        let exists = false

        const result = await permissionSchema.findOne({ guildId })
        // console.log(result)

        if (!result || !result.permissions[0])
            return message.channel.send('No permissions have been set up.')

        let perms = ''
        for (const perm of result.permissions) {
            if (client.users.cache.get(perm.entityId))
                perms += `**${perm.commandName}** - <@${perm.entityId}> - ${perm.permission}\n`

            else if (message.guild.roles.cache.get(perm.entityId))
                perms += `**${perm.commandName}** - <@&${perm.entityId}> - ${perm.permission}\n`

            else
                perms += `**${perm.commandName}** - ${perm.entityId} - ${perm.permission}\n`
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Permissions for ${message.guild.name}`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(perms)

        message.channel.send(embed)
    }
}