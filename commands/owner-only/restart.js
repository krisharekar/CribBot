module.exports = {
    commands: ['restart', 'shutdown', 'refresh'],
    description: 'restarts the bot',
    aliases: ['shutdown', 'refresh'],
    ownerOnly: true,

    async execute(message, args){
        if(!message.author.id === '714808648517550144')
        return message.channel.send('Nice try. But only Krish can use this command.')

        await message.channel.send('Restarting...')
        .then(async msg => {
            await msg.delete({ timeout: 3000 })
        })
        await message.channel.send('Successfully restarted myself.')
        process.exit()
    }
}