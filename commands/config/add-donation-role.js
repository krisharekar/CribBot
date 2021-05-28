const donationRolesSchema = require('../../schemas/donation-roles-schema')
const { abbNum } = require('../../assets/abb-num')

module.exports = {
    commands: ['add-donation-role', 'adddonationrole', 'adrole'],
    description: 'Adds a donation role, which will be given to the user when they reach a certain amount of donations',
    minArgs: 2,
    usage: '<role> <donation-amount>',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        let donationAmount = args[1]
        const guildId = message.guild.id

        if (!role)
            return message.channel.send('Specify a role that exists.')

        donationAmount = abbNum(donationAmount)

        if (isNaN(donationAmount) || donationAmount < 1)
            return message.channel.send('Donation amount must be an integer.')

        const roleId = role.id

        const result = await donationRolesSchema.findOne({ guildId })

        let exists = false

        if (result) {
            for (const donationRole of result.donationRoles) {
                if (donationRole.donationAmount == donationAmount)
                    exists = true
            }
        }

        if (exists)
            return message.channel.send('Donation role with that donation amount already exists.')

        const donationRole = {
            roleId,
            donationAmount
        }

        await donationRolesSchema.findOneAndUpdate({ guildId }, { $push: { donationRoles: donationRole } }, { upsert: true })

        message.channel.send(`Role \`${role.name}\` will be given when a user reaches **⏣ ${donationAmount.toLocaleString()}** amount of donations.`)
    }
}