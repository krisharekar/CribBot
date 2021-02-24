const welcomeSchema = require('../../schemas/welcome-schema')
const { loadWelcomeData } = require('../../cache/welcome-cache')

module.exports = {
    commands: ['set-welcome', 'setwelcome'],
    description: 'Sets welcome message channel',
    permissions: ['ADMINISTRATOR'],

    async execute(message) {
        const guild = message.guild.id
        const channelId = message.channel.id

        await welcomeSchema.findOneAndUpdate({ guildId }, { guildId, channelId }, { upsert: true })

        loadWelcomeData()

        message.channel.send('Welcome channel set!')
    }
}