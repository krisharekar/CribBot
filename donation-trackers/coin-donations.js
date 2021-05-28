const Discord = require('discord.js')
const donationsSchema = require('../schemas/donations-schema')
const { getDonationsChannel } = require('../cache/caches/donations-channel-cache')
const { addDonationRoles } = require('../donation-roles')

module.exports = (client) => {
    client.on('message', async message => {
        const channelId = getDonationsChannel(message.guild.id)
        if (!channelId || !channelId.includes(message.channel.id))
            return;
        if (message.author.id != '270904126974590976')
            return;

        const { content } = message
        if (!content.includes('You gave') || !content.includes('⏣')) //tax
            return;

        // console.log(content)
        // return;

        const user = message.mentions.users.first()
        if(!user) return;
        const userId = user.id
        const guildId = message.guild.id
        const temp = (content.substring(content.indexOf('⏣') + 2))
        const donationAmount = parseInt(temp.substring(0, temp.indexOf('*')).replace(/,/g, ''))
        // console.log(donationAmount)

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount, dailyDonation: donationAmount } }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Thank you for your donation ${message.mentions.users.first().tag}`, message.mentions.users.first().displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .setDescription(`**Amount Donated:** \`⏣ ${donationAmount.toLocaleString()}\`\n**Today's Donation:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\`\n**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
            .setFooter('If this information was incorrect, report it to an admin')

        const msg = await message.channel.send(embed)

        await addDonationRoles(client, guildId, userId)
        client.emit('donationsMade', guildId, userId, client.user.id, 'Added', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
    })
}