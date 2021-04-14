const mongo = require('../../mongo')
const countingSchema = require('../../schemas/counting-schema')

module.exports = {
    commands: ['count-set', 'countset'],
    description: 'Set the counting channel',
    usage: '[channel]',

    async execute(message, args) {
        const guildId = message.guild.id
        const channel = message.guild.channels.cache.get(args[0]) || message.channel
        const channelId = channel.id
        
        const result = await countingSchema.findOneAndUpdate({ guildId }, { guildId, channelId, count: 0 }, { upsert: true })
        message.channel.send(`Counting channel has been set to <#${channelId}>`)
    }
}