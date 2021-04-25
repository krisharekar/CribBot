const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['my-donations', 'mydonations', 'my-donos', 'mydonos'],
    description: 'Shows donations of the author',

    async execute(message, args) {
        const guildId = message.guild.id
        const user = message.member

        const userId = user.user.id

        let result = await donationsSchema.findOne({ guildId, userId })

        if (!result) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Donations of ${user.user.username}`, user.user.displayAvatarURL())
                .setColor('BLUE')
                .setDescription(`**Total Donation:** \`⏣ 0\`\n**Today's Donation:** \`⏣ 0\``)

            return message.channel.send(embed)
        }

        const { donationAmount, dailyDonation } = result


        const embed = new Discord.MessageEmbed()
            .setAuthor(`Donations of ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`**Total Donation:** \`⏣ ${donationAmount.toLocaleString()}\`\n**Today's Donation:** \`⏣ ${dailyDonation ? dailyDonation.toLocaleString() : '0'}\``)

        message.channel.send(embed)
    }
}