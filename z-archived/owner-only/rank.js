const Discord = require('discord.js')

const mongo = require('../../mongo')

const levelSchema = require('../../schemas/level-schema')

const canvacord = require('canvacord')

module.exports = {
    commands: ['rank'],
    description: 'Check your rank in the server (under development)',
    aliases: ['level'],
    usage: '<user>',

    async execute(message, args) {
        member = message.mentions.users.first() || message.author

        const guilId = message.guild.id
        const userId = member.id

        const result = await levelSchema.findOne({
            guilId,
            userId
        })
        console.log(result)

        const rank = new canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(result.xp)
            .setRequiredXP((result.level + 1) * 100)
            .setStatus(member.presence.status)
            .setProgressBar('RANDOM', 'COLOR')
            .setUsername(member.username)
            .setDiscriminator(member.discriminator)
        rank.build()
            .then(image => {
                const rankCard = new Discord.MessageAttachment(image, 'rank.png')
                message.channel.send(rankCard)
            })
    }
}