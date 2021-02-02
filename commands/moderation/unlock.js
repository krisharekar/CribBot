const Discord = require('discord.js')

const ms = require('ms')

module.exports = {
    commands: ['unlock', 'ul'],
    description: 'Locks the channel',
    aliases: ['l'],
    maxArgs: 1,
    permissions: ['MANAGE_CHANNELS'],

    execute(message, args) {
        if (!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR'))
            return message.channel.send("You don't have permission to use this command.")

        let channel = message.mentions.channels.first() || message.channel

        const lockCheck = channel.permissionOverwrites.get(message.guild.id)

        if (lockCheck.allow.has('SEND_MESSAGES'))
            return message.channel.send('The channel is already unlocked.')

        channel.updateOverwrite(message.guild.roles.everyone,
            {
                SEND_MESSAGES: true
            }
        )

        const unlockEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('🔓 Channel Unlocked.')

        channel.send(unlockEmbed)
    }
}