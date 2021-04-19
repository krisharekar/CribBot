const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['donations', 'donos'],
    description: 'Shows donations of a user',
    usage: '[user]',

    async execute(message, args) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0], guildId) || message.guild.members.cache.get(args[0]) || message.member

        const userId = user.user.id

        let result = await donationsSchema.findOne({ guildId, userId })

        if (!result) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Donations of ${user.user.username}`, user.user.displayAvatarURL())
                .setColor('BLUE')
                .setDescription(`**Amount:** \`⏣ 0\``)

            return message.channel.send(embed)
        }

        const { donationAmount } = result


        const embed = new Discord.MessageEmbed()
            .setAuthor(`Donations of ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`**Amount:** \`⏣ ${donationAmount.toLocaleString()}\``)

        message.channel.send(embed)
    }
}