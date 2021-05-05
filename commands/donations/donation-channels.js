const Discord = require('discord.js')
const donationsChannelSchema = require('../../schemas/donations-channel-schema')

module.exports = {
    commands: ['donation-channels', 'donationchannels', 'donochan', 'dc'],
    description: 'Lists the servers donation channels',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id

        const result = await donationsChannelSchema.findOne({ guildId })

        if(!result)
        return message.channel.send('No donations channels have been set.')
        let desc = ''

        for(const chan of result.donationsChannelIds) {
            desc += `<#${chan}>\n`
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(`Donation Channels of ${message.guild.name}`, client.user.displayAvatarURL())
        .setColor('GREEN')
        .addField('Donations Channels:', desc)

        message.channel.send(embed)
    }
}