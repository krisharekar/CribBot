const Discord = require('discord.js')

const mongoose = require('mongoose')

const mongo = require('../../mongo')

const warnSchema = require('../../schemas/warn-schema')

module.exports = {
    commands: ['warnings', 'warns'],
    description: 'Shows the warnings a user',
    aliases: ['warns'],
    usage: '<user> [page]',
    maxArgs: 2,

    async execute(message, args) {

        let target = message.mentions.users.first() || message.author

        const guildId = message.guild.id
        const userId = target.id

        await mongo().then(async mongoose => {
            try {
                const result = await warnSchema.findOne({
                    guildId,
                    userId
                })

                if (!result) {
                    if (userId === message.author.id)
                        return message.channel.send('You are squeaky clean.')

                    else
                        return message.channel.send(`${target.username} is squeaky clean.`)
                }

                let warns = ''

                // for (const warning of result.warnings) {

                //     const { author, timestamp, warnId, reason } = warning

                //     warns += `**Warn ID:** ${warnId}. 
                //     **Warned by:** ${author}.
                //     **Date of warn:** ${new Date(timestamp).toLocaleDateString()}. 
                //     **Reason:** ${reason}\n\n`
                // }

                const page = args[1] || 1

                for (i = (page * 5) - 5; i < page * 5; i++) {
                    if (!result.warnings[(page * 5) - 5])
                        return message.channel.send(`There is no page number \`${page}\`.`)

                    if(!result.warnings[i])
                    break;

                    const { author, timestamp, warnId, reason } = result.warnings[i]

                    warns += `**Warn ID:** ${warnId}. 
                    **Warned by:** ${author}.
                    **Date of warn:** ${new Date(timestamp).toLocaleDateString()}. 
                    **Reason:** ${reason}\n\n`
                }


                const warnsEmbed = new Discord.MessageEmbed()
                    .setTitle(`Warnings for ` + target.username)
                    .setColor('BLUE')
                    .setDescription(warns)
                    .setFooter(`Page Number: ${page}`)

                message.channel.send(warnsEmbed)

            } catch (error) {
                console.log(error)
            } finally {
                mongoose.connection.close()
            }
        })
    }
}
