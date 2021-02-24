const Discord = require('discord.js')
const notesSchema = require('../../schemas/notes-schema')

module.exports = {
    commands: ['delete-note', 'deletenote', 'delnote', 'dn'],
    description: 'Deletes a note of a user',
    minArgs: 2,
    usage: '<user> <noteId>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user)
            return message.channel.send('Specify a user that exists.')
        const userId = user.user.id
        const guildId = message.guild.id
        const noteId = parseInt(args[1])

        if(isNaN(noteId))
        return message.channel.send('The note ID must be a number.')

        const result = await notesSchema.findOne({ guildId, userId })

        if(!result)
        return message.channel.send('The user has no notes.')

        let exists = false

        for (const note of result.notes) {
            if(note.noteId == noteId) {
                await notesSchema.findOneAndUpdate({ guildId, userId }, { $pull: { notes: note } })
                exists = true
            }
        }

        if(!exists)
        return message.channel.send(`Note of ${user.user.tag} with ID \`${noteId}\` doesn't exist.`)

        message.channel.send(`Deleted note of ${user.user.tag} with ID \`${noteId}\`.`)
    }
}