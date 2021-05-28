const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/highest-donor-channel-cache')
const updateHighestDonorChannel = require('../../update-donor-channel')

module.exports = {
    commands: ['set-top-donor-channel', 'settopdonorchannel', 'settdc'],
    description: 'Sets top donor channel which updates every 5 minutes',
    minArgs: 1,
    usage: '<voice-channel>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel)
            return message.channel.send('Specify a channel that exists.')
        const highestDonorChannelId = channel.id

        await donationsChannelSchema.findOneAndUpdate({ guildId }, { highestDonorChannelId }, { upsert: true })
        loadCache()

        if(channel.type != 'voice')
        return message.channel.send('Top donor channel should be a voice channel, as Discord doesn\'t allow special characters in text channel names.')
        
        updateHighestDonorChannel(client, guildId)

        message.channel.send(`Top donor channel set to \`${channel.name}\` (${channel.id})`)
    }
}