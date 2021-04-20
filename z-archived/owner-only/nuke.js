module.exports = {
    commands: ['nuke'],
    ownerOnly: true,

    async execute(message, args) {
        const role = message.guild.roles.cache.get('800687205751455754')

        const filter = m => m.author.id === message.author.id
        await message.channel.send('Are you sure you want to nuke the server? `[y/n]`')
        let msg
        await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
        .then(async (collected) => {
            msg = collected.first()
        })
        .catch(() => {
            message.channel.send('You did not respond in time.')
        })

        if (!msg)
            return;
        if (!role)
            return message.channel.send('**Nuke failed.**')

        message.guild.channels.cache.forEach(c => {
            if (c.type != 'category') {
                c.updateOverwrite(role.id, {
                    VIEW_CHANNEL: false
                })
            }
        })

        const memberCount = message.guild.memberCount
        message.channel.send(`Banned **${memberCount}** members.`)
    }
}