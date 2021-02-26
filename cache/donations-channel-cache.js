const donationsChannelCache = new Map()
const donationsChannelSchema = require('../schemas/donations-channel-schema')

module.exports.loadDonationsChannelData = async () => {
    const results = await donationsChannelSchema.find()
    if(!results) return;
    for (const result of results) {
        donationsChannelCache.set(result.guildId, result.channelId)
    }
}

module.exports.getDonationsChannel = (guildId) => {
    return donationsChannelCache.get(guildId)
}