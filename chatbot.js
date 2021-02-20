const mongo = require('./mongo')
const chatBotSchema = require('./schemas/chatbot-schema')
const { prefixFinder } = require('./prefix-finder')
const fetch = require('node-fetch')
const alexa = require('alexa-bot-api')
const ai = new alexa('aw2plm')

module.exports = (client) => {

    const cache = {}

    client.on('message', async (message) => {
        const prefix = prefixFinder(message.guild.id)
        if (!message.content.toLowerCase().startsWith(prefix + 'setchatbot'))
            return;

        const { member, channel, guild } = message
        const guildId = guild.id

        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command.')
            return
        }

        message.delete()

        cache[guild.id] = [channel.id]
        // console.log(cache)

        await mongo().then(async (mongoose) => {
            try {
                await chatBotSchema.findOneAndUpdate(
                    {
                        guildId
                    },
                    {
                        guildId,
                        channelId: channel.id
                    },
                    {
                        upsert: true
                    }
                )

                message.channel.send('Chat Bot channel has been successfully set. You can now chat with me here.')
            } finally {
                mongoose.connection.close()
            }
        })
    })

    client.on('message', async (message) => {
        if (message.author.bot)
            return;
        if (message.content.toLowerCase().startsWith(prefix))
            return;
        const { guild } = message
        const guildId = guild.id

        let data = cache[guildId]
        // console.log(data)
        let result = 'something'

        if (!data) {
            await mongo().then(async (mongoose) => {
                try {
                    result = await chatBotSchema.findOne({ guildId })

                    if (!result)
                        return;

                    cache[guildId] = data = [result.channelId]
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        if (!result)
            return;

        const channelId = data[0]
        // console.log(channelId)

        if (message.channel.id !== channelId)
            return;

        message.channel.startTyping()

        let res = await fetch(`http://api.snowflakedev.cf:9019/api/chatbot?message=${message.content}&name=Sebastian&gender=MALE&user=${message.author.id}`, {
            headers: {
                "authorization": "NjgzMzQzMTE0ODY1NjA2Njg2.MTYwNzUxMTg3NC4wNw==.9f3d5f44dbd8e17c0fa767740ed710f3"
            }
        }
        )
        const body = await res.json()
        message.channel.send(body.message)
        message.channel.stopTyping()

        // if (!reply)
        //     message.channel.send('Wait...')
        // else
        //     message.channel.send(reply)
        // return;
    })
}