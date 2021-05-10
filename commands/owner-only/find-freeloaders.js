const Discord = require('discord.js')

module.exports = {
    commands: ['find-freeloaders', 'findfreeloaders', 'ffs'],
    description: 'Finds freeloaders',
    minArgs: 1,
    usage: '<channel> [message-count]',
    ownerOnly: true,

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

        message.channel.send('Searching for stinky freeloaders...')

        const messages = await fetchMessages(channel, limit)
        const freeloaders = []
        const bannedFreeloaders = []

        for (const msg of messages) {
            const exists = message.guild.members.cache.get(msg.author.id)
            if (!exists && msg.author.bot) {
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

        // console.log(messages.length)

        // let freeloaderMessage = ''
        // let bannedFreeloaderMessage = ''

        // for (const freeloader of freeloaders) {
        //     // if(freeloaders[freeloader.length-1] != freeloader)
        //     freeloaderMessage += `${freeloader.name} (${freeloader.id})\n`
        //     // else
        //     // freeloaderMessage += `${freeloader.name} (${freeloader.id})`
        // }
        // for (const bannedFreeloader of bannedFreeloaders) {
        //     bannedFreeloaderMessage += `${bannedFreeloader.name} (${bannedFreeloader.id})\n`
        // }

        const content = `FREELOADER ALERT!\n\nFreeloaders are:\n${freeloaders.length ? freeloaders.join('\n') : 'None'}\n\nFreeloaders who are already banned are:\n${bannedFreeloaders.length ? bannedFreeloaders.join('\n') : 'None'}`

        if (content.length > 2000) {
            // const c = content.match(/(.|[\r\n]){1,10}/g)
            // console.log(c)
            return message.channel.send('Damn, found too many freeloaders that Discord wont let me sent such a huge message :C\nMaybe try reducing message count.')
        }
        message.channel.send(content).then(() => console.log('sent'))
    }
}

async function fetchMessages(channel, limit = 200) {
    const allMessages = [];
    let lastId;

    while (true) {
        const options = limit > 100 ? { limit: 100 } : { limit };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options).catch(e => console.log(e))
        allMessages.push(...messages.array());
        console.log(allMessages.length)
        lastId = messages.last().id;

        if (messages.size != 100 || allMessages.length >= limit) {
            console.log('done')
            break;
        }
    }
    // console.log(allMessages.length)

    return allMessages;
}