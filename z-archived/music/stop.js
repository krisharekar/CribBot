const Discord = require('discord.js')
const ytdl = require('ytdl-core')

module.exports = {
    commands: ['stop', 's'],
    description: 'Stops playing music',
    
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel
        if(!voiceChannel)
        return message.channel.send('You need to be in a voice channel to execute this command.')

        voiceChannel.leave()
        return message.channel.send('Stopped playing music.')
    }
}