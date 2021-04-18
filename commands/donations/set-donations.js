const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const { abbNum } = require('../../assets/abb-num')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['set-donations', 'setdonations', 'set-donos', 'setdonos', 'sd'],
    description: 'Sets donations for a user',
    minArgs: 2,
    usage: '<user> <amount>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0]) || message.guild.users.cache.get(args[0])
        let donationAmount = args[1]

        if (!user)
            return message.channel.send('Specify a user that exists.')

        donationAmount = abbNum(donationAmount)

        if (isNaN(donationAmount))
            return message.channel.send('Donation amount must be an integer.')

        if (donationAmount % 1 != 0)
            return message.channel.send('Donation amount must be an integer.')

        const userId = user.id

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { donationAmount }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Set donations for ${user.username}`, user.displayAvatarURL())
            .setColor('GREEN')
            .setDescription(`**New Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)

        message.channel.send(embed)
    }
}