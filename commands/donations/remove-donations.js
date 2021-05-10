const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const { addDonationRoles } = require('../../donation-roles')
const { removeDonationRoles } = require('../../donation-roles')
const { abbNum } = require('../../assets/abb-num')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['remove-donations', 'removedonations', 'rdonos', 'rd'],
    description: 'Removes donations from a user',
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

        if (isNaN(donationAmount) || donationAmount < 1)
            return message.channel.send('Donation amount must be an integer.')

        if (donationAmount % 1 != 0)
            return message.channel.send('Donation amount must be an integer.')

        const userId = user.user.id

        let result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount: -donationAmount, dailyDonation: -donationAmount } }, { upsert: true, new: true })

        if(result.dailyDonation < 0)
        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { dailyDonation: 0 }, { new: true })
        
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Removed donations from ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`**Amount Removed:** \`⏣ ${donationAmount.toLocaleString()}\`\n**Today's Donation:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\`\n**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)

        message.channel.send(embed)

        client.emit('donationsMade', guildId, userId, message.author.id, -donationAmount, undefined, result.donationAmount, result.dailyDonation)
        await removeDonationRoles(client, guildId, userId)
        await addDonationRoles(client, guildId, userId)
    }
}