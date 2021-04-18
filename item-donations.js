const Discord = require('discord.js')
const donationsSchema = require('./schemas/donations-schema')
const { getDonationsChannel } = require('./cache/caches/donations-channel-cache')
const { getInfo } = require('./assets/get-info')
const { addDonationRoles } = require('./donation-roles')

module.exports = (client) => {
    client.on('message', async message => {
        const channelId = getDonationsChannel(message.guild.id)
        if (!channelId || !channelId.includes(message.channel.id))
            return;
        if (message.author.id != '270904126974590976')
            return;

        const { content } = message
        if (!content.includes('You gave') || content.includes('⏣'))
            return;

        // console.log(content)

        const userId = message.mentions.users.first().id
        const guildId = message.guild.id
        const temp = (content.substring(content.indexOf('*') + 2))
        // console.log(temp)
        const itemAmount = parseInt(temp.substring(0, temp.indexOf('*')).replace(/,/g, ''))
        const itemName = temp.substring(temp.indexOf('*') + 3, temp.indexOf(', '))
        // console.log(itemAmount, itemName)

        const itemInfo = getInfo(itemName)
        const donationAmount = itemInfo.value*itemAmount
        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount } }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Thank you for your donation ${message.mentions.users.first().tag}`, message.mentions.users.first().displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .setDescription(`**Item Donated:** \`${itemInfo.name} (${itemAmount})\`
            **Amount Donated:** \`⏣ ${donationAmount.toLocaleString()}\`
            **Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
            .setFooter('If this information was incorrect, report it to Krish')

        message.channel.send(embed)

        await addDonationRoles(client, guildId, userId)
    })
}