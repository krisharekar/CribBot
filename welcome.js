const mongo = require('./mongo')
const welcomeSchema = require('./schemas/welcome-schema')
const { prefix } = require('./config.json')
const { Guild } = require('discord.js')

module.exports = (client) => {
    //!setwelcome <message>
    const cache = {} // guildId: [channelId, text]

    client.on('message', async (message) => {
        if (!message.content.toLowerCase().startsWith(prefix + 'setwelcome'))
            return;
        const { member, channel, content, guild } = message
        const guildId = guild.id

        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command.')
            return
        }

        let text = content

        const split = text.split(' ')

        if (split.length < 2) {
            channel.send('Please provide a welcome message')
            return
        }

        message.delete()

        split.shift()
        text = split.join(' ')

        cache[guild.id] = [channel.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await welcomeSchema.findOneAndUpdate(
                    {
                        guildId
                    },
                    {
                        guildId,
                        channelId: channel.id,
                        text,
                    },
                    {
                        upsert: true,
                    }
                )

                message.channel.send('Welcome channel and message have been set.').then(msg => msg.delete({ timeout: 3000 }))
            } finally {
                mongoose.connection.close()
            }
        })
    })

    const onJoin = async (member) => {
        const { guild } = member
        const guildId = guild.id

        let data = cache[guildId]
        let result
        if (!data) {
            await mongo().then(async (mongoose) => {
                try {
                    result = await welcomeSchema.findOne({ guildId })
                } finally {
                    mongoose.connection.close()
                }
            })
        }
        if(!result)
        return;
        
        cache[guildId] = data = [result.channelId, result.text]

        const channelId = data[0]
        const text = data[1]

        const channel = guild.channels.cache.get(channelId)
        channel.send(text.replace(/{member}/g, `<@${member.id}>`))
    }

    client.on('guildMemberAdd', (member) => {
        onJoin(member)
    })
}