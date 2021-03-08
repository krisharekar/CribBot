const welcomeSchema = require('../../schemas/welcome-schema')
const { loadCache } = require('../../cache/caches/welcome-message-cache')

module.exports = {
    commands: ['set-welcome-message', 'setwelcomemessage'],
    description: 'Sets welcome message ',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args) {
        const guildId = message.guild.id
        const welcomeMessage = args.join(' ')

        await welcomeSchema.findOneAndUpdate({ guildId }, { guildId, welcomeMessage }, { upsert: true })

        loadCache()

        message.channel.send('Welcome message set!')
    }
}