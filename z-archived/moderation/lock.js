const Discord = require('discord.js')

const ms = require('ms')

module.exports = {
    commands: ['lock', 'l'],
    description: 'Locks the channel',
    aliases: ['l'],
    usage: '[channel] [time]',
    maxArgs: 2,
    permissions: ['MANAGE_CHANNELS'],

    execute(message, args){
        if(!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR'))
        return message.channel.send("You don't have permission to use this command.")

        let channel = message.mentions.channels.first() || message.channel 

        const lockCheck = channel.permissionOverwrites.get(message.guild.id)

        if (lockCheck.deny.has('SEND_MESSAGES'))
            return message.channel.send('The channel is already locked.')

        let time

        if(channel == message.channel)
        time = args[0]

        else
        time = args[1]

        channel.updateOverwrite(message.guild.roles.everyone,
            {
                SEND_MESSAGES: false
            }
        )

        const lockEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`🔒 ${channel} has been locked.`)

        channel.send(lockEmbed)

        const unlockEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('🔓 Channel Unlocked.')

        if(time){
            setTimeout(function() {
                channel.updateOverwrite(message.guild.roles.everyone,
                    {
                        SEND_MESSAGES: true
                    }
                )

                channel.send(unlockEmbed)
            }, ms(time))
        }
    }
}