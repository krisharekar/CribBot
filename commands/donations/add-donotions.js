const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const { addDonationRoles } = require('../../donation-roles')
const { removeDonationRoles } = require('../../donation-roles')
const { abbNum } = require('../../assets/abb-num')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['add-donations', 'adddonations', 'adonos', 'ad'],
    description: 'Adds or subtracts donations from a user',
    minArgs: 2,
    usage: '<user> <amount>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0], guildId) || message.guild.members.cache.get(args[0])
        let donationAmount = args[1]

        if (!user)
            return message.channel.send('Specify a user that exists.')

        donationAmount = abbNum(donationAmount)

        if (isNaN(donationAmount) || donationAmount == 0)
            return message.channel.send('Donation amount must be an integer.')

        if (donationAmount % 1 != 0)
            return message.channel.send('Donation amount must be an integer.')

        const userId = user.user.id

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount, dailyDonation: donationAmount } }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Added donations to ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`**Amount Added:** \`⏣ ${donationAmount.toLocaleString()}\`
                            **Today's Donation:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\`
                            **Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)

        message.channel.send(embed)
        await removeDonationRoles(client, guildId, userId)
        await addDonationRoles(client, guildId, userId)      
    }
}