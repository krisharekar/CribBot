const { prefixFinder } = require('../prefix-finder')
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

    for(const permission of permissions){
        if(!validPermissions.includes(permission))
        throw new Error(`Unknown permission node '${permission}'`)
    }
}

module.exports = (client, commandOptions) => {
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

    if(typeof commands === 'string')
    commands = [commands]

    if(permissions.length){
        if(typeof permissions === 'string')
        permissions = [permissions]

        validatePermissions(permissions)
    }

    const cooldowns = new Discord.Collection()

    client.on('message', message => {
        const prefix = prefixFinder(message.guild.id)
        if(!message.content.startsWith(prefix) || message.author.bot)
        return;
        
        const { member, content, guild } = message

        for(const alias of commands){
            const command = `${alias.toLowerCase()}`

            const args = content.slice(prefix.length).trim().split(/ +/)

            const commandName = args.shift().toLowerCase()
            
            if(commandName === command){

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

                if(ownerOnly && message.author.id != '714808648517550144')
                return message.channel.send('Nice try but only Krish can use this command.')

                for(const permission of permissions){
                    if(!member.hasPermission(permission))
                    return message.channel.send(`You don't have permission to use this command. Required permission \`${permission}\`.`)
                }

                for(const requiredRole of requiredRoles){
                    const role = guild.roles.cache.find(role => role.name === requiredRole)

                    if(!role || !member.roles.cache.has(role.id))
                    return message.channel.send(`You must have the \`${requiredRole}\` role to use this command.`)
                }

                if(args.length < minArgs || (maxArgs != null && args.length > maxArgs))
                return message.channel.send(`Incorrect usage.\nThe correct usage would be \`${prefix}${alias} ${usage}\``)
            
                execute(message, args, client, prefix)
            }
        }
    })
}