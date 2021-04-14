const notesSchema = require('../../schemas/notes-schema')

module.exports = {
    commands: ['set-note', 'setnote', 'sn'],
    description: 'Set notes for a user',
    minArgs: 2,
    usage: '<user> <note>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user)
        return message.channel.send('Specify a user that exists.')
        const userId = user.user.id
        const guildId = message.guild.id
        const newNote = args.slice(1).join(' ')
        
        const result = await notesSchema.findOne({ guildId, userId })

        const noteId = result ? result.totalNotes+1 : 1

        const notesData = {
            authorId: message.author.id,
            noteId,
            note: newNote
        }

        await notesSchema.findOneAndUpdate({ guildId, userId }, { $inc: { totalNotes: 1 }, $push: { notes: notesData } }, { upsert: true })

        message.channel.send(`<a:yes:812287920198123540> **Note Set!**\n**User:** ${user.user.tag}\n**Note:** *${newNote}*`)
    }
}