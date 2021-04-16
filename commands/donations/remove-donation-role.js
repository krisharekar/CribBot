const donationRolesSchema = require('../../schemas/donation-roles-schema')
const { abbNum } = require('../../assets/abb-num')

module.exports = {
    commands: ['remove-donation-role', 'removedonationrole', 'rdrole'],
    description: 'Removes a donation role',
    minArgs: 1,
    usage: '<donation-amount>',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args) {
        let donationAmount = args[0]
        const guildId = message.guild.id

        donationAmount = abbNum(donationAmount)

        if (isNaN(donationAmount) || donationAmount < 1)
            return message.channel.send('Donation amount must be an integer.')

        const result = await donationRolesSchema.findOne({ guildId })

        let exists = false
        let roleId

        if (result) {
            for (const donationRole of result.donationRoles) {
                if (donationRole.donationAmount == donationAmount) {
                    exists = true
                    roleId = donationRole.roleId
                    await donationRolesSchema.findOneAndUpdate({ guildId }, { $pull: { donationRoles: donationRole } }, { upsert: true })
                    break;
                }
            }
        }

        if (!exists)
            return message.channel.send('Donation role with that donation amount doesn\'t exist.')

        const role = message.guild.roles.cache.get(roleId)

        message.channel.send(`Removed donation role (\`${role ? role.name : 'deleted role'}\`) which was to be given when a user reached **⏣ ${donationAmount.toLocaleString()}** amount of donations.`)
    }
}