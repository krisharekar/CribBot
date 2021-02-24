const Discord = require('discord.js')
const notesSchema = require('../../schemas/notes-schema')

module.exports = {
    commands: ['notes'],
    description: 'Shows notes of a user',
    minArgs: 1,
    usage: '<user> [page]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user)
        return message.channel.send('Specify a user that exists.')
        const userId = user.user.id
        const page = args[1] || 1

        const result = await notesSchema.findOne({ guildId, userId })
        let notes = ''

        if(!result || !result.notes[0])
        return message.channel.send('The user has no notes.')

        // console.log(result)

        for (i = (page * 5) - 5; i < page * 5; i++) {
            if (!result.notes[(page * 5) - 5])
                return message.channel.send(`There is no page number \`${page}\`.`)

            if (!result.notes[i])
                break;

            const { authorId, noteId, note } = result.notes[i]

            notes += `**Note ID:** ${noteId}
                    **Note by:** <@${authorId}>
                    **Note:** ${note}\n\n`
        }
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Notes for ${user.user.username}`, user.user.displayAvatarURL())
        .setColor('BLUE')
        .setDescription(notes)
        .setFooter(`Page Number: ${page}`)

    message.channel.send(embed)
    }
}