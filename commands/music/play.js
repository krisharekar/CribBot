const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const yt = require('youtube-sr')

module.exports = {
    commands: ['play', 'p'],
    description: 'Plays music in channel',
    usage: '<song>',
    minArgs: 1,

    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel
        let connection
        const query = args.join(' ')
        if(!voiceChannel)
        return message.channel.send('You need to be in a voice channel to execute this command.')

        const permission = voiceChannel.permissionsFor(client.user)
        if(!permission.has('CONNECT'))
        return message.channel.send('I do not have permissions to join that voice channel.')
        if(!permission.has('SPEAK'))
        return message.channel.send('I do not have permissions to play music in that channel.')

        try {
            connection = await voiceChannel.join()
        }
        catch (err) {
            console.log(err)
            return message.channel.send('There was an error connecting to that voice channel.')
        }

        const result = await yt.search(query, { limit: 1 })
        const video = result[0]
        const videoId = video.id
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`
        if(!video)
        return message.channel.send('No results found.')

        message.channel.send(`Now playing: \`${video.title}\` | Duration: \`${video.durationFormatted}\` | Requested by: \`${message.author.tag}\``)

        const dispatcher = connection.play(ytdl(videoLink))
        .on('finish', () => {
            voiceChannel.leave()
        })
    }
}