const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const yt = require('youtube-sr')
const { execute } = require('./play')

module.exports = {
    commands: ['search', 'find'],
    description: 'Searchs youtube for a video',
    minArgs: 1,

    async execute(message, args, client) {
        const query = args.join(' ')

        const result = await yt.search(query, { limit: 10 })
        let videos = ''
        let count = 1

        for(const video of result) {
            videos += `**${count}.** ${video.title} | ${video.durationFormatted}\n`
            count++
        }
        const embed = new Discord.MessageEmbed()
        .setColor('#2c2f33')
        .setDescription(videos)

        message.channel.send(embed)
    }
}