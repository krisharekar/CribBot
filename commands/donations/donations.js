const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['donations', 'donos'],
    description: 'Shows donations of a user',
    usage: '<user>',
    minArgs: 1,
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0], guildId) || message.guild.members.cache.get(args[0])

        if(!user)
        return message.channel.send('Mention a user that exists.')

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