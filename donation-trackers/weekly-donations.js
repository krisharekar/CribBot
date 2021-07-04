const donationsSchema = require('../schemas/donations-schema')
const cron = require('node-cron')

module.exports = async (client) => {
    cron.schedule('0 0 0 * * 1', async () => {
        await resetWeeklyDonations(client)
    }, { timezone: 'Etc/UTC' })

}

async function resetWeeklyDonations(client) {
    // let count = 0
    // let failed = 0
    // client.guilds.cache.forEach(async g => {
    //     const guildId = g.id
    //     await donationsSchema.updateMany({ guildId, weeklyDonation: { $ne: 0 } }, { weeklyDonation: 0 }, { new: true })
    // })
    const channel = client.channels.cache.get('775970225279074327')
    channel.send(`UPDATED **${client.guilds.cache.size}** server's weekly donations.`)
}