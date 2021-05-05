const Discord = require('discord.js')
const { getDonationLogsChannel } = require('./cache/caches/donation-logs-channel-cache')

module.exports = (client) => {
    client.on('donationsMade', (guildId, userId, adderId, donationAmount, itemDonated, totalDonations, todaysDonations) => {
        const donationLogsChannel = getDonationLogsChannel(guildId)
        if(!donationLogsChannel)
        return;

        const channel = client.channels.cache.get(donationLogsChannel)
        const user = client.users.cache.get(userId)
        const adder = adderId == client.user.id ? client.user : client.users.cache.get(adderId)

        if(!channel)
        return;

        const embed = new Discord.MessageEmbed()
        .setAuthor(`Donation Logs`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor('BLUE')
        .addField('Donor', `${user.tag} (${user.id})`)
        .addField('Donations added by', ` ${adder.tag} (${adder.id})`)
        .addField('Amount added', `\`⏣ ${donationAmount.toLocaleString()}\``)
        .setTimestamp()

        if(itemDonated)
        embed.addField('Item Donated', `\`${itemDonated.name} (${itemDonated.amount.toLocaleString()})\``)

        embed
        .addField('Total Donations', `\`⏣ ${totalDonations.toLocaleString()}\``)
        .addField('Today\'s Donations', `\`⏣ ${todaysDonations.toLocaleString()}\``)

        channel.send(embed)
        // console.log(`GUILD ID: ${guildId}\nUSER ID: ${userId}\nDONATION AMOUNT: ${donationAmount}`)
    })
}