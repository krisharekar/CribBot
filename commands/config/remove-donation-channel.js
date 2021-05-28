const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/donations-channel-cache')

module.exports = {
    commands: ['remove-donation-channel', 'removedonationchannel', 'removedonochan', 'removedc'],
    description: 'Removes a donation channel',
    usage: '[channel]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
        const donationsChannelId = channel.id

        const result = await donationsChannelSchema.findOne({ guildId })
        // console.log(result)
        
        if(result && result.donationsChannelIds && !result.donationsChannelIds.includes(donationsChannelId))
        return message.channel.send(`<#${donationsChannelId}> is not a donation channel.`)

        const data = await donationsChannelSchema.findOneAndUpdate({ guildId }, { $pull: { donationsChannelIds: donationsChannelId } }, { upsert: true, new: true })
        loadCache()

        let desc = ''

        for(const chan of data.donationsChannelIds) {
            desc += `<#${chan}>\n`
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(`Donation channel removed`, client.user.displayAvatarURL())
        .setColor('GREEN')
        .addField('Donations Channels:', desc)

        message.channel.send(`<#${donationsChannelId}> is no longer a donation channel.`, embed)
    }
}