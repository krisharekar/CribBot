const Discord = require('discord.js')
const donationsSchema = require('./schemas/donations-schema')
const { getDonationsChannel } = require('./cache/donations-channel-cache')

module.exports = (client) => {
    client.on('message', async message => {
        const channelId = getDonationsChannel(message.guild.id)
        if(!channelId || message.channel.id != channelId)
        return;
        if(message.author.id != '270904126974590976')
        return;

        const { content } = message
        if(!content.includes('You gave') || !content.includes('tax'))
        return;

        // console.log(content)

        const userId = message.mentions.users.first().id
        const guildId = message.guild.id
        const temp = (content.substring(content.indexOf('⏣')+2))
        const donationAmount = parseInt(temp.substring(0, temp.indexOf('*')).replace(/,/g, ''))
        // console.log(donationAmount)

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount } }, { upsert: true, new: true })
    
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Thank you for your donation ${message.mentions.users.first().tag}`, message.mentions.users.first().displayAvatarURL({ dynamic: true }))
        .setColor('BLUE')
        .setDescription(`**Amount Donated:** \`⏣ ${donationAmount.toLocaleString()}\`
        **Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
        .setFooter('If this information was incorrect, report it to Krish')

        message.channel.send(embed)
    })
}