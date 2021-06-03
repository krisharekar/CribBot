module.exports = {
    commands: ['find-freeloaders', 'findfreeloaders', 'ffs'],
    description: 'Finds freeloaders and banned freeloaders',
    minArgs: 1,
    usage: '<heist-channel> [number-of-members-to-search-from]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        const limit = (args[1]) || 200
        // console.log(limit)

        if (!channel)
            return message.channel.send('Specify a channel that exists.')

        if (isNaN(limit))
            return message.channel.send('Message count must be an integer')

        if (limit < 1 || limit > 1000)
            return message.channel.send('Message count must be between 1-1000.')

        const botMsg = await message.channel.send([`Searching for stinky freeloaders...`,
            `Indexing: ${'□'.repeat(10)} 0%`,
            `Searching: ${'□'.repeat(10)} 0%`])

        const messages = await fetchMessages(channel, limit, botMsg)
        const freeloaders = []
        const bannedFreeloaders = []
        const number = messages.length / 100
        const increment = 10 / number
        let num = 0
        let loaded = 0

        for (const msg of messages) {
            num++
            if (num % 100 == 0 || number < 1) {
                loaded = loaded + increment
                await botMsg.edit([`Searching for stinky freeloaders...`,
                    `Indexing: ${'■'.repeat(10)} 100%`,
                    `Searching: ${'■'.repeat(loaded.toFixed() <= 10 ? loaded.toFixed() : 10)}${'□'.repeat(10 - loaded.toFixed() >= 0 ? 10 - loaded.toFixed() : 0)} ${Math.round(loaded * 10) <= 100 ? Math.round(loaded * 10) : 100}%`])
            }
            const exists = message.guild.members.cache.get(msg.author.id)
            if (!exists && !msg.author.bot) {
                if (!exists) {
                    const bans = await message.guild.fetchBans()
                    if (bans.find(u => u.user == msg.author)) {
                        if (!bannedFreeloaders.find(key => key == `${msg.author.username} (${msg.author.id})`))
                            bannedFreeloaders.push(`${msg.author.username} (${msg.author.id})`)
                        // bannedFreeloaders.push({ name: msg.author.username, id: msg.author.id })
                    }

                    else if (!freeloaders.find(key => key == `${msg.author.username} (${msg.author.id})`))
                        freeloaders.push(`${msg.author.username} (${msg.author.id})`)
                    // freeloaders.push({ name: msg.author.username, id: msg.author.id })
                }
            }
        }

        if (!freeloaders.length && !bannedFreeloaders.length)
            return message.channel.send('No freeloaders found!')

        let content = `FREELOADER ALERT!\n\nFreeloaders are:\n${freeloaders.length ? freeloaders.join('\n') : 'None'}\n\nFreeloaders who are already banned are:\n${bannedFreeloaders.length ? bannedFreeloaders.join('\n') : 'None'}`

        if (content.length > 2000) {
            const num = Math.ceil(content.length / 2000)
            let temp = content
            content = []
            for (i = 1; i <= num; i++) {
                const index = temp.lastIndexOf("\n", 2000)
                console.log(index)
                message.channel.send(temp.slice(0, index))
                temp = temp.slice(index)
            }

            // return message.channel.send('Damn, found so many freeloaders that Discord wont let me sent such a huge message :C\nMaybe try reducing message count.')
            return;
        }
        message.channel.send(content)
    }
}

async function fetchMessages(channel, limit = 200, message) {
    const allMessages = [];
    let lastId;
    const number = (limit / 100) // 500 = 500/100 = 5 = 10/5 = 2 
    console.log(number)
    const increment = 10 / number
    let loaded = increment
    while (true) {
        const options = limit > 100 ? { limit: 100 } : { limit };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options).catch(e => console.log(e))
        allMessages.push(...messages.array());
        // console.log(loaded)
        const content = [`Searching for stinky freeloaders...`,
            `Indexing: ${'■'.repeat(loaded.toFixed() <= 10 ? loaded.toFixed() : 10)}${'□'.repeat(10 - loaded.toFixed() >= 0 ? 10 - loaded.toFixed() : 0)} ${Math.round(loaded * 10) <= 100 ? Math.round(loaded * 10) : 100}%`,
            `Searching: ${'□'.repeat(10)} 0%`]
        await message.edit(content)
        loaded = loaded + increment
        // console.log(loaded)
        // console.log(allMessages.length)
        lastId = messages.last().id;

        if (messages.size != 100 || allMessages.length >= limit) {
            break;
        }
    }
    // console.log(allMessages.length)

    return allMessages;
}