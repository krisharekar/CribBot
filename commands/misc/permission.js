const permissionSchema = require('../../schemas/permission-schema')
const { loadCache } = require('../../cache/caches/permissions-cache')
const getUserFromMention = require('../../assets/get-user-from-mention')

module.exports = {
    commands: ['permission', 'perm'],
    description: 'Changes permission required for a command',
    minArgs: 3,
    usage: '<allow/deny> <role/member> <command/module>',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const permission = args[0].toLowerCase()
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
        const member = getUserFromMention(args[1], guildId) || message.guild.members.cache.get(args[1])
        const commandOrModule = args[2].toLowerCase()

        if (permission != 'allow' && permission != 'deny')
            return message.channel.send('First argument must be `allow` or `deny`')

        if (!role && !member)
            return message.channel.send('Specify a role or member that exists.')

        const commands = client.commands.array().filter(key => { return key.module != 'owner-only' })
        const modules = []
        let exists = false
        let commandName
        let isModule = false

        for (const cmd of client.commands) {
            if (cmd[1].commands.includes(commandOrModule)) {
                exists = true
                commandName = cmd[0]
                break;
            }
        }
        for (const command of commands) {
            if (!modules.includes(command.module))
                modules.push(command.module)
        }

        // if (!client.commands.includes(command.toLowerCase()))

        if (!exists) {
            commandName = modules.find(key => key == commandOrModule)

            if (!commandName)
                return message.channel.send(`\`${commandOrModule}\` command or module doesn't exist.`)
            else isModule = true;
        }

        const entityId = role ? role.id : member.user.id
        const entityName = role ? role.name : member.user.tag

        // const result = await permissionSchema.find({ guildId, permissions: { $elemMatch: { entityId, commandName }}})
        const result = await permissionSchema.find({ guildId })
        // console.log(result)

        if (result[0]) {
            for (const perm of result[0].permissions) {
                if (perm.entityId == entityId && commandName == perm.commandName && perm.permission == permission) {
                    return message.channel.send(`${isModule ? 'Module' : 'Command'} \`${commandName}\` is already set to \`${permission}\` for \`${entityName}\`.`)
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

        message.channel.send(`${isModule ? 'Module' : 'Command'} \`${commandName}\` set to \`${permission}\` for \`${entityName}\`.`)
    }
}