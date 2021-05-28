const Discord = require('discord.js')
const { getDonationLogsChannel } = require('./cache/caches/donation-logs-channel-cache')

module.exports = (client) => {
    client.on('donationsMade', (guildId, userId, managerId, type, donationAmount, itemDonated, totalDonations, todaysDonations, messageLink, channelName, categoryDetails, categoryDonations) => {
        const donationLogsChannel = getDonationLogsChannel(guildId)
        if (!donationLogsChannel)
            return;

        const channel = client.channels.cache.get(donationLogsChannel)
        const user = client.users.cache.get(userId)
        const manager = managerId == client.user.id ? client.user : client.users.cache.get(managerId)

        if (!channel)
            return;

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Donation Logs`, client.user.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .addField('Donor', `${user.tag} (${user.id})`)
            .setFooter(channelName)
            .setTimestamp()
            .addField(`Donations ${type} By`, `${manager.tag} (${manager.id})`)

        if (categoryDetails && !categoryDetails.dankMemerCoins)
            embed.addField(`Amount ${type}`, `\`${donationAmount.toLocaleString()}\``)
        else
            embed.addField(`Amount ${type}`, `\`⏣ ${donationAmount.toLocaleString()}\``)

        if (itemDonated)
            embed.addField('Item Donated', `\`${itemDonated.name} (${itemDonated.amount.toLocaleString()})\``)

        if (categoryDetails) {
            if (categoryDetails.dankMemerCoins)
                embed.addField(`${categoryDetails.categoryName} Donations`, `\`⏣ ${categoryDonations.toLocaleString()}\``)
            else
                embed.addField(`${categoryDetails.categoryName} Donations`, `\`${categoryDonations.toLocaleString()}\``)

            if (categoryDetails.addTotal) {
                embed
                    .addField('Today\'s Donations', `\`⏣ ${todaysDonations.toLocaleString()}\``)
                    .addField('Total Donations', `\`⏣ ${totalDonations.toLocaleString()}\``)
            }
        }

        else {
            embed
                .addField('Today\'s Donations', `\`⏣ ${todaysDonations.toLocaleString()}\``)
                .addField('Total Donations', `\`⏣ ${totalDonations.toLocaleString()}\``)
        }

        embed.addField('Message Link', `[Jump to message](${messageLink})`)

        channel.send(embed)
        // console.log(`GUILD ID: ${guildId}\nUSER ID: ${userId}\nDONATION AMOUNT: ${donationAmount}`)
    })
}