const Discord = require('discord.js')
const { getDonationLogsChannel } = require('./cache/caches/donation-logs-channel-cache')

module.exports = (client) => {
    client.on('donationsMade', (guildId, userId, managerId, donationAmount, itemDonated, totalDonations, todaysDonations, messageLink, channelName) => {
        const donationLogsChannel = getDonationLogsChannel(guildId)
        if(!donationLogsChannel)
        return;

        const channel = client.channels.cache.get(donationLogsChannel)
        const user = client.users.cache.get(userId)
        const manager = managerId == client.user.id ? client.user : client.users.cache.get(managerId)

        if(!channel)
        return;

        const embed = new Discord.MessageEmbed()
        .setAuthor(`Donation Logs`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor('BLUE')
        .addField('Donor', `${user.tag} (${user.id})`)
        .setFooter(channelName)
        .setTimestamp()

        if(donationAmount > 0) {
            embed
            .addField('Donations added by', `${manager.tag} (${manager.id})`)
            .addField('Amount added', `\`⏣ ${donationAmount.toLocaleString()}\``)
        }
        else {
            embed
            .addField('Donations removed by', `${manager.tag} (${manager.id})`)
            .addField('Amount removed', `\`⏣ ${Math.abs(donationAmount).toLocaleString()}\``)
        }

        if(itemDonated)
        embed.addField('Item Donated', `\`${itemDonated.name} (${itemDonated.amount.toLocaleString()})\``)

        embed
        .addField('Total Donations', `\`⏣ ${totalDonations.toLocaleString()}\``)
        .addField('Today\'s Donations', `\`⏣ ${todaysDonations.toLocaleString()}\``)
        .addField('Message Link', `[Jump to message](${messageLink})`)

        channel.send(embed)
        // console.log(`GUILD ID: ${guildId}\nUSER ID: ${userId}\nDONATION AMOUNT: ${donationAmount}`)
    })
}