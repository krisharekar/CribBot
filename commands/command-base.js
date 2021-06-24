const { prefixFinder } = require('../assets/prefix-finder')
// const { getBlacklists } = require('../cache/caches/blacklists-cache')
const { getPermissions } = require('../cache/caches/permissions-cache')
const Discord = require('discord.js')

const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission))
            throw new Error(`Unknown permission node '${permission}'`)
    }
}

module.exports = (client, commandOptions, message, args, prefix) => {
    let {
        commands = [],
        description,
        usage,
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        cooldown = 2,
        ownerOnly,
        execute
    } = commandOptions

    if (typeof commands === 'string')
        commands = [commands]

    if (permissions.length) {
        if (typeof permissions === 'string')
            permissions = [permissions]

        validatePermissions(permissions)
    }

    const cooldowns = new Discord.Collection()

    // if (message.author.id != '714808648517550144') //697815325650976789
    // return;

    const guildPermissions = getPermissions(message.guild.id)

    const { member, content, guild } = message

    const command = commands[0]

    if (!cooldowns.has(command)) {
        cooldowns.set(command, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command);
    const cooldownAmount = (cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`You can use this command after \`${timeLeft.toFixed(1)}\` more seconds.`);
        }
    }

    if (ownerOnly && message.author.id != '714808648517550144')
        return;

    let perm
    // console.log(guildPermissions)
    if (guildPermissions) {
        for (const permission of guildPermissions) {
            // console.log(commandName, permission.commandName)
            if (command == permission.commandName && (permission.entityId == message.author.id || message.member.roles.cache.has(permission.entityId))) {
                perm = permission.permission
                // console.log(perm)
                if (perm == 'allow')
                    break;
            }
        }
    }
    for (const permission of permissions) {
        console.log(member.hasPermission(permission))
        if (!member.hasPermission(permission) && perm != 'allow') {
            // console.log(1)
            return message.channel.send(`You don't have permission to use this command.`)
        }

        if (!member.hasPermission('ADMINISTRATOR') && perm == 'deny') {
            // console.log(2)
            return message.channel.send(`You don't have permission to use this command.`)
        }
    }
    if (!permissions.length && !member.hasPermission('ADMINISTRATOR') && perm == 'deny') {
        // console.log(3)
        return message.channel.send(`You don't have permission to use this command.`)
    }

    if (args.length < minArgs || (maxArgs != null && args.length > maxArgs))
        return message.channel.send(`Incorrect usage.\nThe correct usage would be \`${prefix}${alias} ${usage}\``)

    execute(message, args, client, prefix)
}

