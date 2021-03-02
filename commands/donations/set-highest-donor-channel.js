const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/highest-donor-channel-cache')

module.exports = {
    commands: ['set-highest-donor-channel', 'sethighestdonorchannel', 'sethdc'],
    description: 'Sets highest donor channel',
    minArgs: 1,
    usage: '<channel>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel)
            return message.channel.send('Specify a channel that exists.')
        const highestDonorChannelId = channel.id

        await donationsChannelSchema.findOneAndUpdate({ guildId }, { highestDonorChannelId }, { upsert: true })
        loadHighestDonorChannelData()

        message.channel.send(`Highest donor channel set to \`${channel.name}\``)
    }
}