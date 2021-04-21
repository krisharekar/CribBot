const donationsSchema = require('../schemas/donations-schema')
const cron = require('node-cron')

module.exports = async (client) => {
    cron.schedule('0 0 0 * * *', async () => {
        await resetDailyDonations(client)
    }, { timezone: 'Etc/UTC' })

}

async function resetDailyDonations (client) {
    client.guilds.cache.forEach(async g => {
        const guildId = g.id
        await donationsSchema.updateMany({ guildId, dailyDonation: { $ne: 0 } }, { dailyDonation: 0 }, { new: true }) 
        const channel = client.channels.cache.get('775970225279074327')
        channel.send(`UPDATED **${g.name}**'s daily donations.`)
    })
}