const Discord = require('discord.js')
const mongoose = require('mongoose')
const mongo = require('../../mongo')
const warnSchema = require('../../schemas/warn-schema')
module.exports = {
    commands: ['warn', 'w'],
    description: 'Warns a user in the server',
    usage: '<user> [reason]',
    permissions: ['KICK_MEMBERS'],

    async execute(message, args) {
        if (!message.member.hasPermission('KICK_MEMBERS'))
            return message.channel.send("You don't have permissions to use this command.")
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!target) 
            return message.channel.send('Please specify someone to warn.')
          
        if(message.member.roles.highest.position < target.roles.highest.position)
        return message.channel.send('You cannot warn a member who has a higher role than you.')
        
        args.shift()
        const guildId = message.guild.id
        const guildName = message.guild.name
        const userId = target.id
        const userName = target.username
        const reason = args.join(' ') || 'Unspecified'

        await mongo().then(async (mongoose) => {
            const result = await warnSchema.findOne({
                guildId,
                userId
            })
            if(!result)
            warnId = 1
            else
            warnId = result.totalWarnings + 1
        })

        const warning = {
            author: message.member.user.tag,
            timestamp: new Date().getTime(),
            warnId,
            reason,
        }

        await mongo().then(async (mongoose) => {
            try {
                await warnSchema.findOneAndUpdate(
                    {
                        guildId,
                        userId
                    },
                    {
                        guildId,
                        guildName,
                        userId,
                        userName,
                        $inc: {
                            totalWarnings: 1
                        },
                        $push: {
                            warnings: warning,
                        },
                    },
                    {
                        upsert: true,
                    }
                )
            } finally {
                mongoose.connection.close()
            }
        })
        const warnEmbed = new Discord.MessageEmbed()
            .setTitle(target.user.username + ' has been warned.')
            .setColor('BLUE')
        message.channel.send(warnEmbed)

        const channel = message.guild.channels.cache.find(c => c.name.includes('logs'))

        if(!channel)
        return;

        const warnLogEmbed = new Discord.MessageEmbed() 
        .setTitle('Member Warned')
        .setColor('RANDOM')
        .setThumbnail(target.user.displayAvatarURL())
        .addField('User Warned', target)
        .addField('Warned by', message.author)
        .addField('Reason', reason)
        .setTimestamp()
        channel.send(warnLogEmbed)
    }
}
