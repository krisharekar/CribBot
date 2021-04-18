const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['donations', 'donos'],
    description: 'Shows donations of a user',
    usage: '[user]',

    async execute(message, args) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0]) || message.guild.users.cache.get(args[0]) || message.author

        const userId = user.id

        let result = await donationsSchema.findOne({ guildId, userId })

        if (!result) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Donations of ${user.username}`, user.displayAvatarURL())
                .setColor('BLUE')
                .setDescription(`**Amount:** \`⏣ 0\``)

            return message.channel.send(embed)
        }

        const { donationAmount } = result


        const embed = new Discord.MessageEmbed()
            .setAuthor(`Donations of ${user.username}`, user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`**Amount:** \`⏣ ${donationAmount.toLocaleString()}\``)

        message.channel.send(embed)
    }
}