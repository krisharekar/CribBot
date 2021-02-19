const Discord = require('discord.js')

module.exports = {
    commands: ['lockdown', 'ld'],
    description: 'Locks the complete server',
    usage: '[role] [view-channels]',
    permissions: ['MANAGE_CHANNELS'],

    async execute(message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role && args[0])
            return message.channel.send(`Couldn't find \`${role}\` role.`)
        const roleId = role ? role.id : message.guild.id
        const viewChannels = args[1] || 'true'
        if (viewChannels != 'true' && viewChannels != 'false')
            return message.channel.send('View channels must be either `true` or `false`.')

        await message.channel.send('Lockdown in proccess. This may take a few seconds depending on the number of channels.')

        message.guild.channels.cache.forEach(async ch => {
            if (ch.type == 'text') {
                if (viewChannels == 'true') {
                    await ch.updateOverwrite(roleId, {
                        SEND_MESSAGES: false
                    }, `Action requested by ${message.author.tag}`)
                }
                else {
                    await ch.updateOverwrite(roleId, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    }, `Action requested by ${message.author.tag}`)
                }
            }
            else if (ch.type == 'voice') {
                if (viewChannels == 'true') {
                    await ch.updateOverwrite(roleId, {
                        CONNECT: false
                    }, `Action requested by ${message.author.tag}`)
                }
                else {
                    await ch.updateOverwrite(roleId, {
                        CONNECT: false,
                        VIEW_CHANNEL: false
                    }, `Action requested by ${message.author.tag}`)
                }
            }
        })

        if(roleId == message.guild.id)
        message.channel.send(`Locked every channel in the server for \`everyone\` and set View Channel to \`${viewChannels}\`.`)
        
        else
        message.channel.send(`Locked every channel in the server for \`${role.name}\` and set View Channel to \`${viewChannels}\`.`)
    }
}