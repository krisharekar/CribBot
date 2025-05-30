const donationsChannelCache = new Map()
const donationsChannelSchema = require('../../schemas/donations-channel-schema')

module.exports.loadCache = async () => {
    const results = await donationsChannelSchema.find()
    if(!results) return;
    for (const result of results) {
        if(result.donationsChannelIds)
        donationsChannelCache.set(result.guildId, result.donationsChannelIds)
    }
}

module.exports.getDonationsChannel = (guildId) => {
    return donationsChannelCache.get(guildId)
}