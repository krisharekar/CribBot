const blacklistSchema = require('../../schemas/blacklist-schema')
const { loadCache } = require('../../cache/caches/blacklists-cache')

module.exports = {
    commands: ['white-list', 'whitelist', 'wl'],
    description: 'whitelists a user from using the bot',
    minArgs: 1,
    usage: '<user>',
    ownerOnly: true,

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user)
        return message.channel.send('Specify a user that exists.')
        const userId = user.user.id
        const guildId = message.guild.id

        // if(userId == message.author.id)
        // return message.channel.send('Why would you wanna whitelist yourself.')
        
        const result = await blacklistSchema.findOne({ guildId })

        let exists

        for(const user of result.users) {
            if(userId == user)
            exists = true
        }

        if(!exists)
        return message.channel.send('The user is already whitelisted.')

        await blacklistSchema.findOneAndUpdate({ guildId }, { $pull: { users: userId } }, { upsert: true })

        message.channel.send(`Whitelisted ${user.user.tag}.`)
        loadCache()
    }
}