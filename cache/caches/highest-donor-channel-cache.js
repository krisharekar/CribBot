const highestDonorChannelCache = new Map()
const donationsChannelSchema = require('../../schemas/donations-channel-schema')

module.exports.loadCache = async () => {
    const results = await donationsChannelSchema.find()
    if(!results) return;
    for (const result of results) {
        if(result.highestDonorChannelId)
        highestDonorChannelCache.set(result.guildId, result.highestDonorChannelId)
    }
}

module.exports.getHighestDonorChannel = (guildId) => {
    return highestDonorChannelCache.get(guildId)
}