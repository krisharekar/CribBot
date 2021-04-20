const mongo = require('./mongo')
const { count } = require('./z-archived/schemas/counting-schema')
const countingSchema = require('./z-archived/schemas/counting-schema')

module.exports = async (client) => {

    client.on('message', async message => {
        if(message.author.id == client.user.id)
        return;

        const guildId = message.guild.id
        const channelId = message.channel.id
        let count = parseInt(message.content)

        const result = await countingSchema.findOne({ guildId })
        if (!result)
            return;

        if (channelId != result.channelId)
            return;

        // console.log(`CURRENT COUNT: ${result.count} | NEXT COUNT: ${result.count+1} | THIS COUNT: ${count}`)
        // console.log(result)

        if (count != result.count+1)
            return message.delete()

        // console.log('CORRECT COUNT')

        await countingSchema.findOneAndUpdate({ guildId }, { count })

    })
}