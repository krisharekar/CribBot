module.exports = {
    commands: ['giveawayreroll', 'greroll'],
    description: 'Rerolls giveaway',
    usage: '<message-id>',
    minArgs: 1,
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const messageId = args[0]
        if(isNaN(messageId))
        return message.channel.send('Provide a valid message ID.')
        client.giveawaysManager.reroll(messageId)
        .catch(err => {
            return message.channel.send(`No giveaway found with message ID \`${messageId}\``)
        })
    }
}