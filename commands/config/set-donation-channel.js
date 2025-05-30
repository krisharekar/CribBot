const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')
const { loadCache } = require('../../cache/caches/donations-channel-cache')

module.exports = {
    commands: ['set-donation-channel', 'setdonationchannel', 'setdonochan', 'setdc'],
    description: 'Assigns channel where donations will be automatically added',
    usage: '[channel]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if(!args[0])
        channel = message.channel

        if(!channel)
        return message.channel.send(`Channel \`${args[0]}\` doesn\'t exist.`)
        const donationsChannelId = channel.id

        const result = await donationsChannelSchema.findOne({ guildId })
        // console.log(result)
        
        if(result && result.donationsChannelIds && result.donationsChannelIds.includes(donationsChannelId))
        return message.channel.send(`<#${donationsChannelId}> is already set as a donation channel.`)

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

        message.channel.send(`<#${donationsChannelId}> set as a donation channel.`, embed)
    }
}