const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/donations-channel-cache')

module.exports = {
    commands: ['add-donations-channel', 'adddonationschannel', 'adddonoschan', 'adddc'],
    description: 'Assigns channel where donations will be tracked',
    usage: '[channel]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
        const donationsChannelId = channel.id

        const result = donationsChannelSchema.findOne({ guildId })
        
        if(result && result.donationsChannelIds && result.donationsChannelIds.includes(donationsChannelId))
        return message.channel.send(`<#${donationsChannelId}> is already set as a donations channel.`)

        const data = await donationsChannelSchema.findOneAndUpdate({ guildId }, { $push: { donationsChannelIds: donationsChannelId } }, { upsert: true, new: true })
        loadCache()

        let desc = ''

        for(const chan of data.donationsChannelIds) {
            desc += `<#${chan}>\n`
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(`Donation channel added`, client.user.displayAvatarURL())
        .setColor('GREEN')
        .addField('Donations Channels:', desc)

        message.channel.send(`<#${donationsChannelId}> set as a donations channel.`, embed)
    }
}