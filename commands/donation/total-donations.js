const donationsSchema = require("../../schemas/donations-schema")

module.exports = {
    commands: ['total-donations', 'totaldonations', 'totaldonos', 'td'],
    description: 'Shows the total donations of the server',

    async execute(message, args) {
        const guildId = message.guild.id
        const result = await donationsSchema.find({ guildId })

        if (!result) return message.channel.send('Total Donations Of The Server: \`⏣ 0\`.')

        let totalDonations = 0

        for (const donations of result) {
            if (isNaN(donations.donationAmount)) continue;
            totalDonations += donations.donationAmount
        }

        message.channel.send(`Total Donations Of The Server: \`⏣ ${totalDonations.toLocaleString()}\`.`)
    }
}