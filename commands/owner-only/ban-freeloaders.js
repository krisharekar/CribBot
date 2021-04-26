const Discord = require('discord.js')

module.exports = {
    commands: ['find-freeloaders', 'findfreeloaders', 'ffs'],
    description: 'Finds freeloaders',
    minArgs: 1,
    usage: '<channel> [message-count]',
    ownerOnly: true,

    async execute(message, args, client) {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        const limit = parseInt(limit) || 200

        if (!channel)
            return message.channel.send('Specify a channel that exists.')

        if(isNaN(limit))
        return message.channel.send('Message count must be an integer')

        if(limit < 1 || limit > 1000)
        return message.channel.send('Message count must be between 1 to 1000.')

        message.channel.send('Searching for stinky freeloaders...')

        const messages = await fetchMessages(channel, 200)
        const freeloaders = []

        for (const msg of messages) {
            const exists = message.guild.members.cache.get(msg.author.id)

            // if(msg.author.bot)
            // console.log(msg.author)

            if (!exists && !msg.author.bot)
                freeloaders.push({ name: msg.author.username, id: msg.author.id })
        }

        if(!freeloaders.length)
        return message.channel.send('No freeloaders found!')

        // console.log(messages.length)

        let freeloaderMessage = ''

        for (const freeloader of freeloaders) {
            freeloaderMessage += `${freeloader.name} (${freeloader.id})\n`
        }

        message.channel.send(`FREELOADER ALERT!\n\nFreeloaders are:\n${freeloaderMessage}`)
    }
}

async function fetchMessages(channel, limit = 500) {
    const allMessages = [];
    let lastId;

    while (true) {
        const options = { limit: 100 };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options).catch(e => console.log(e))
        allMessages.push(...messages.array());
        lastId = messages.last().id;

        if (messages.size != 100 || allMessages.length >= limit) {
            break;
        }
    }

    return allMessages;
}