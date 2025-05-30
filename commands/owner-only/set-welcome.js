const welcomeSchema = require('../../schemas/welcome-schema')
const { loadCache } = require('../../cache/caches/welcome-cache')

module.exports = {
    commands: ['set-welcome', 'setwelcome'],
    description: 'Sets welcome message channel',
    permissions: ['ADMINISTRATOR'],

    async execute(message) {
        const guildId = message.guild.id
        const channelId = message.channel.id

        await welcomeSchema.findOneAndUpdate({ guildId }, { guildId, channelId }, { upsert: true })

        loadCache()

        message.channel.send('Welcome channel set!')
    }
}