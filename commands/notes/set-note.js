const notesSchema = require('../../schemas/notes-schema')

module.exports = {
    commands: ['set-note', 'setnote'],
    description: 'Set notes for a user',
    minArgs: 2,
    usage: '<user> <note>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const userId = user.id
        const guildId = message.guild.id
        const newNote = args.slice(1).join(' ')

        const result = await notesSchema.findOne({ guildId })
        let newNotes
        const exists = false

        for(const note of result.notes) {
            if(note.userId == userId) {
                newNotes = note.notes.push(newNote)
                exists = true
            }
        }

        if(!exists) {
            newNotes = [newNote]
        }

        const notesData = {
            userId,
            notes: newNotes
        }

        await notesSchema.findOneAndUpdate({ guildId }, { $push: { notes: notesData } })

        message.channel.send(`Note Set\n`)
    }
}