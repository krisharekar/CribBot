const permissionSchema = require('../../schemas/permission-schema')
const { loadCache } = require('../../cache/caches/permissions-cache')

module.exports = {
    commands: ['permission', 'perm'],
    description: 'Changes permission required for a command',
    minArgs: 3,
    usage: '<allow/deny> <role/member> <command>',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const permission = args[0]
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        const command = args[2]

        if (permission.toLowerCase() != 'allow' && permission.toLowerCase() != 'deny')
            return message.channel.send('First argument must be `allow` or `deny`')

        if (!role && !member)
            return message.channel.send('Specify a role or member that exists.')

        let exists = false
        let commandName

        for (const cmd of client.commands) {
            if (cmd[0].commands.includes(command)) {
                exists = true
                commandName = cmd[0].commands[0]
                break
            }
        }

        // if (!client.commands.includes(command.toLowerCase()))

        if (!exists)
            return message.channel.send(`\`${command}\` command doesnt exist.`)

        const entityId = role ? role.id : member.user.id
        const entityName = role ? role.name : member.user.tag

        // const result = await permissionSchema.find({ guildId, permissions: { $elemMatch: { entityId, commandName }}})
        const result = await permissionSchema.find({ guildId })
        console.log(result)

        if (result[0]) {
            for (const perm of result[0].permissions) {
                if (perm.entityId == entityId && commandName == perm.commandName && perm.permission == permission) {
                    return message.channel.send(`Command \`${commandName}\` is already set to \`${permission}\` for \`${entityName}\`.`)
                }
                else if (perm.entityId == entityId && commandName == perm.commandName)
                    await permissionSchema.findOneAndUpdate({ guildId }, { $pull: { permissions: perm } })
            }
        }

        // if (result[0] && result[0].permissions[0].permission == permission)
        //     return message.channel.send(`Command \`${commandName}\` is already set to \`${permission}\` for \`${entityName}\`.`)

        const permssionObject = {
            entityId,
            permission,
            commandName
        }

        await permissionSchema.findOneAndUpdate({ guildId }, { $push: { permissions: permssionObject } }, { upsert: true })
        loadCache()

        message.channel.send(`Command \`${commandName}\` set to \`${permission}\` for \`${entityName}\`.`)
    }
}