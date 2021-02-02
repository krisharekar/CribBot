module.exports = {
    commands: ['purge', 'clear', 'delete'],
    description: 'Deletes a number of messages from the channel',
    aliases: ['clear', 'delete'],
    usage: '<message-count>',
    minArgs: 1,
    permissions: ['MANAGE_MESSAGES'],

    async execute(message, args) {
        const deleteCount = parseInt(args[0], 10);

        if (deleteCount < 1 || deleteCount > 99)
            return message.reply('You can delete only up to 99 messages.')

        if (isNaN(deleteCount))
            return message.channel.send('Provide a valid number.')

        const fetched = await message.channel.messages.fetch({
            limit: deleteCount + 1
        });

        try {
            await message.channel.bulkDelete(fetched)
            message.channel.send(`Deleted ${deleteCount} messages.`)
                .then(msg => {
                    msg.delete({ timeout: 2000 })
                })
        } catch (error) {
            console.error()
            return message.channel.send('I can\'t delete messages over 14 days ago.')
        }

    }
}