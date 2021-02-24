const Discord = require('discord.js')
const notesSchema = require('../../schemas/notes-schema')

module.exports = {
    commands: ['clearnotes', 'cn'],
    description: 'clears all the notes of a user',
    minArgs: 1,
    usage: '<user>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user)
        return message.channel.send('Specify a user that exists.')
        const userId = user.user.id
        const guildId = message.guild.id
        
        const result = await notesSchema.findOneAndDelete({ guildId, userId })

        if(!result)
        return message.channel.send('The user has no notes.')

        message.channel.send(`<a:yes:812287920198123540> Cleared all notes of **${user.user.tag}**.`)
    }
}