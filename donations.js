const donationsSchema = require('./schemas/donations-schema')
const { getDonationsChannel } = require('./cache/donations-channel-cache')

module.exports = (client) => {
    client.on('message', async message => {
        const channelId = getDonationsChannel(message.guild.id)
        if(!channelId || message.channel.id != channelId)
        return;
        if(message.author.id != '270904126974590976')
        return;

        const { content } = message
        if(!content.includes('You gave') || !content.includes('tax'))
        return;

        // console.log(content)

        const userId = message.mentions.users.first().id
        const guildId = message.guild.id
        const temp = (content.substring(content.indexOf('⏣')+2))
        const donationAmount = parseInt(temp.substring(0, temp.indexOf('*')).replace(/,/g, ''))
        console.log(donationAmount)

        await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount } }, { upsert: true })
    })
}