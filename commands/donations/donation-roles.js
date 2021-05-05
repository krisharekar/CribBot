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

        let donationRolesAndAmounts = ''
        const donationRoles = result.donationRoles.sort((a, b) => { return a.donationAmount - b.donationAmount })
        const highestLength = donationRoles[donationRoles.length - 1].donationAmount.toLocaleString().length

        for (const donationRole of donationRoles) {
            const role = message.guild.roles.cache.get(donationRole.roleId)
            donationRolesAndAmounts += `\`⏣ ${donationRole.donationAmount.toLocaleString().padEnd(highestLength)} :\` ${role}\n`
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name}'s Donation Roles`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`${donationRolesAndAmounts}`)

        message.channel.send(embed)
    }
}