const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')

module.exports = {
    commands: ['set-donations', 'setdonations', 'set-donos', 'setdonos', 'sd'],
    description: 'Adds or subtracts donations from a user',
    minArgs: 2,
    usage: '<user> <amount>',
    permssions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let donationAmount = args[1]

        if (!user)
            return message.channel.send('Specify a user that exists.')

        if (donationAmount.includes('e') && donationAmount.lenght != 1) {
            let temp = donationAmount.split('e')
            // console.log(temp)
            donationAmount = temp[0] * Math.pow(10, temp[1])
            // console.log(donationAmount)
        }

        if (isNaN(donationAmount))
            return message.channel.send('Donation amount must be an integer.')

        if (donationAmount % 1 != 0)
            return message.channel.send('Donation amount must be an integer.')

        const userId = user.user.id

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { donationAmount }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Set donations for ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('GREEN')
            .setDescription(`**New Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)

        message.channel.send(embed)
    }
}