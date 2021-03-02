const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/donations-channel-cache')

module.exports = {
    commands: ['set-donations-channel', 'setdonationschannel', 'setdonoschan', 'setdc'],
    description: 'Sets donation channel',
    usage: '[channel]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
        const donationsChannelId = channel.id

        await donationsChannelSchema.findOneAndUpdate({ guildId }, { donationsChannelId }, { upsert: true })
        loadCache()

        message.channel.send(`Donations channel set to <#${donationsChannelId}>`)
    }
}