const Discord = require('discord.js')

module.exports = {
    commands: ['createchannel', 'cchannel', 'createchan'],
    description: 'Creates a new channel (under development)',
    aliases: ['cchannel', 'createchan'],
    usage: '',

    async execute(client, message, args) {

        if (client.user.hasPermission('MANAGE_SERVER' || 'ADMINSTRATOR')) {

            if (message.member.hasPermission('MANAGE_SERVER' || 'ADMINSTRATOR')){

                var filter = m => m.author.id === message.author.id
                await message.channel.send("What name you want to give the channel? You have 30 seconds to respond.")
                var messages = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                    .catch(err => {
                        return message.channel.send("You did not respond in time.")
                    })

                const channelName = message.first()

                var filter = m => m.author.id === message.author.id
                await message.channel.send("What type of channel you want to create (text or voice)? You have 30 seconds to respond.")
                var messages = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                    .catch(err => {
                        return message.channel.send("You did not respond in time.")
                    })

                const channelType = message.first()

                try {
                    guild.channels.create(`${channelName}`, { type: `${channelType}` })
                } catch (error) {
                    console.error()
                    if(error)
                    return message.channel.send("Something went wrong.")
                }
            }
            else
            return message.reply("You don't have permissions to use this command.")
        }
        else
        return message.channel.send("I don't have the 'Manage Server' permission.")
    }
}