const donationLogsChannelCache = new Map()
const donationsChannelSchema = require('../../schemas/donations-channel-schema')

module.exports.loadCache = async () => {
    const results = await donationsChannelSchema.find()
    if(!results) return;
    for (const result of results) {
        if(result.donationLogsChannelId)
        donationLogsChannelCache.set(result.guildId, result.donationLogsChannelId)
    }
}

module.exports.getDonationLogsChannel = (guildId) => {
    return donationLogsChannelCache.get(guildId)
}