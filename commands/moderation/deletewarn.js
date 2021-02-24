const Discord = require('discord.js')

const mongo = require('../../mongo')

const mongoose = require('mongoose')

const warnSchema = require('../../schemas/warn-schema')

module.exports = {
    commands: ['deletewarn', 'delwarn', 'unwarn', 'removewarn'],
    description: 'Removes a user\'s warning',
    minArgs: 2,
    usage: '<user> <warnId>',
    permission: ['KICK_MEMBERS'],

    async execute(message, args) {
        const user = message.mentions.users.first()
        const userId = user.id
        const guildId = message.guild.id

        let result

        if (args[1] == 'all' || args[1] == 'everything') {

            result = await warnSchema.findOne({
                guildId,
                userId
            })
            if (!result)
                return;

            await warnSchema.findOneAndDelete(
                {
                    guildId,
                    userId
                }
            )


            if (!result)
                return message.channel.send('The user has no warnings.')

            else
                return message.channel.send(`Removed all warnings for ${user.username}.`)
        }

        if (isNaN(args[1]))
            return message.channel.send('Warn ID has to be a number.')

        const warnId = parseInt(args[1])

        let value = false


        result = await warnSchema.findOne({
            guildId,
            userId
        })

        if (!result)
            return message.channel.send('The user has no warnings.')

        for (warning of result.warnings) {
            if (warning.warnId == warnId) {
                value = true

                await warnSchema.findOneAndUpdate(
                    {
                        guildId,
                        userId
                    },
                    {
                        $inc: {
                            totalWarnings: -1
                        },
                        $pull: {
                            warnings: warning
                        }
                    })

                const info = await warnSchema.findOne(
                    {
                        guildId,
                        userId
                    }
                )
                if (info.totalWarnings == 0)
                    await warnSchema.findOneAndDelete(
                        {
                            guildId,
                            userId
                        }
                    )
            }
        }

        if (value == true)
            message.channel.send(`Removed warn with warn ID: ${warnId} from ${user.username}.`)

        else
            message.channel.send(`The user has no warning with warn ID: ${warnId}.`)
    }
}