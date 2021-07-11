const Discord = require('discord.js')
const donationsSchema = require('../schemas/donations-schema')
const { getDonationsChannel } = require('../cache/caches/donations-channel-cache')
const { getInfo } = require('../assets/get-info')
const { addDonationRoles } = require('../assets/donation-roles')
const { getItemInfos } = require('../cache/caches/item-info-cache')

module.exports = (client) => {
    client.on('message', async message => {
        if (message.author.id != '270904126974590976')
            return;
        const channelId = getDonationsChannel(message.guild.id)
        if (!channelId || !channelId.includes(message.channel.id))
            return;

        const { content } = message
        if (!content.includes('You gave') || content.includes('⏣'))
            return;

        // console.log(content)

        const user = message.mentions.users.first()
        if (!user) return;
        const userId = user.id
        const guildId = message.guild.id
        const tempStr = content.includes('**Tip**') ? content.substring(0, content.lastIndexOf('**Tip**')) : content
        console.log(tempStr)
        const strWithoutItem = (tempStr.substring(0, tempStr.lastIndexOf('**')))
        const strWithoutItemAmount = (tempStr.substring(tempStr.lastIndexOf('**') + 3))
        console.log(strWithoutItem)
        console.log(strWithoutItemAmount)
        const itemAmount = parseInt(strWithoutItem.substring(strWithoutItem.lastIndexOf('**') + 2).replace(/,/g, ''))
        const itemName = strWithoutItemAmount.substring(0, strWithoutItemAmount.indexOf(', '))
        console.log(itemAmount, itemName)
        console.log(strWithoutItem.substring(strWithoutItem.lastIndexOf('**') + 2))

        const itemInfo = getInfo(itemName)
        const guildItemInfos = getItemInfos(guildId)
        let guildItemInfo
        if (guildItemInfos)
            guildItemInfo = guildItemInfos.find(key => key.id == itemName)
        // console.log(guildItemInfo)
        if (guildItemInfo && guildItemInfo.value == 0) //disabled item
            return;
        const donationAmount = guildItemInfo ? guildItemInfo.value * itemAmount : itemInfo.value * itemAmount
        const item = {
            name: itemInfo.name,
            value: guildItemInfo ? guildItemInfo.value : itemInfo.value,
            amount: itemAmount
        }
        console.log(item.value)
        if (isNaN(item.value))
            return;
        // console.log(donationAmount)
        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount, dailyDonation: donationAmount } }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Thank you for your donation ${message.mentions.users.first().tag}`, message.mentions.users.first().displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .setDescription(`**Item Donated:** \`${itemInfo.name} (${itemAmount.toLocaleString()})\`\n**Amount Donated:** \`⏣ ${donationAmount.toLocaleString()}\`\n**Today's Donation:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\`\n**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
            .setFooter('If this information was incorrect, report it to an admin')

        const msg = await message.channel.send(embed)

        await addDonationRoles(client, guildId, userId, msg.channel.id)
        client.emit('donationsMade', guildId, userId, client.user.id, 'Added', donationAmount, item, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
    })
}