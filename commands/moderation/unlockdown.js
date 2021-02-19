const Discord = require('discord.js')

module.exports = {
    commands: ['unlockdown', 'uld'],
    description: 'Unlocks the complete server',
    usage: '[role]',
    permissions: ['MANAGE_CHANNELS'],

    async execute(message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role && args[0])
            return message.channel.send(`Couldn't find \`${role}\` role.`)
        const roleId = role ? role.id : message.guild.id

        await message.channel.send('Unlockdown in proccess. This may take a few seconds depending on the number of channels.')

        message.guild.channels.cache.forEach(async ch => {
            if (ch.type == 'text') {
                await ch.updateOverwrite(roleId, {
                    SEND_MESSAGES: null,
                    VIEW_CHANNEL: null
                }, `Action requested by ${message.author.tag}`)
            }
            else if (ch.type == 'voice') {
                await ch.updateOverwrite(roleId, {
                    CONNECT: null,
                    VIEW_CHANNEL: null
                }, `Action requested by ${message.author.tag}`)
            }
        })

        if (roleId == message.guild.id)
            message.channel.send(`Unlocked every channel in the server for \`everyone\`.`)

        else
            message.channel.send(`Unlocked every channel in the server for \`${role.name}\`.`)
    }
}