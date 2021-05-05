const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/donation-logs-channel-cache')

module.exports = {
    commands: ['set-donation-logs', 'setdonationlogs', 'setdl'],
    usage: '[channel]',
    description: 'Sets the donation logs channe;',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const channel = args[0] ? message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) : message.channel

        if(!channel)
        return message.channel.send('Specify a channel that exists.')

        if(channel.type != 'text')
        return message.channel.send('Channel must be a text channel.')

        const donationLogsChannelId = channel.id

        await donationsChannelSchema.findOneAndUpdate({ guildId }, { donationLogsChannelId }, { upsert: true })

        message.channel.send(`Set <#${donationLogsChannelId}> as the donation logs channel.`)
        loadCache()
    }
}