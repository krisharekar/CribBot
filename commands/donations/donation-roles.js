const Discord = require('discord.js')
const donationRolesSchema = require('../../schemas/donation-roles-schema')

module.exports = {
    commands: ['donation-roles', 'donationroles', 'droles'],
    description: 'Will list all the donation roles of the server',

    async execute(message, args, client) {
        const guildId = message.guild.id

        const result = await donationRolesSchema.findOne({ guildId })

        if (!result || !result.donationRoles[0])
            return message.channel.send('No donation roles have been set up.')

        const donationRoles = result.donationRoles.sort((a, b) => { return a.donationAmount - b.donationAmount })

        let roles = ''
        let donationAmounts = ''

        /**
         * [{userData.donationAmount}]
         */
        for (const donationRole of donationRoles) {
            const role = message.guild.roles.cache.get(donationRole.roleId)
            roles += `${role}\n`
            donationAmounts += `\`⏣ ${donationRole.donationAmount.toLocaleString()}\`\n`
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name}'s Donation Roles`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .addField('Donation roles', roles, true)
            .addField('Amount required', donationAmounts, true)

        message.channel.send(embed)
    }
}