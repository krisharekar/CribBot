const Discord = require('discord.js')
const categorySchema = require('../../schemas/category-schema')
const { fetchLeaderboard } = require('../../assets/leaderboard')
const { computeLeaderboard } = require('../../assets/leaderboard')

module.exports = {
    commands: ['donations-leaderboard', 'donationsleaderboard', 'donos-leaderboard', 'donosleaderboard', 'donoslb', 'dlb'],
    description: 'Shows donations leaderboard of the server',
    minArgs: 1,
    usage: '<total/daily> [page]',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const lbName = args[0].toLowerCase()
        const categoryId = lbName
        const page = parseInt(args[1]) || 1
        const start = (parseInt(args[1]) * 10) - 10 || 0
        const end = parseInt(args[1]) * 10 || 10

        let categoryResult = await categorySchema.findOne({ guildId }, { category: { $elemMatch: { categoryId } } })

        if ((lbName != 'total' && lbName != 'daily') && (!categoryResult || !categoryResult.category.length))
            return message.channel.send(`Category \`${categoryId}\` doesn\'t exist.`)

        if (isNaN(page))
            return message.channel.send('Page must be a number.')

        let reply = ''
        let rawLb = await fetchLeaderboard(guildId, lbName)
        const pageCount = Math.ceil(rawLb.length / 10)

        if (rawLb.length < 1)
            return message.channel.send('Nobody\'s in leaderboard yet.')

        else if (!rawLb.slice(start, end).length)
            return message.channel.send(`Page \`${page}\` doesnt exist.`)

        const leaderboard = await computeLeaderboard(client, rawLb.slice(start, end), true, lbName)

        let lb

        const embed = new Discord.MessageEmbed()

        if (lbName == 'total') {
            lb = leaderboard.map(e => `**${e.position + start}.** ${e.username}#${e.discriminator}\n**Total Donations:** \`⏣ ${e.donationAmount.toLocaleString()}\``)
            embed.setAuthor(`${message.guild.name}'s Total Leaderboard`, message.guild.iconURL({ dynamic: true }))
        }
        else if (lbName == 'daily') {
            lb = leaderboard.map(e => `**${e.position + start}.** ${e.username}#${e.discriminator}\n**Today's Donations:** \`⏣ ${e.dailyDonation ? e.dailyDonation.toLocaleString() : '0'}\``)
            embed.setAuthor(`${message.guild.name}'s Today's Leaderboard`, message.guild.iconURL({ dynamic: true }))
        }
        else {
            lb = leaderboard.map(e => `**${e.position + start}.** ${e.username}#${e.discriminator}\n**${categoryResult.category[0].categoryName} Donations:** \`⏣ ${e.categoryDonation ? e.categoryDonation.toLocaleString() : '0'}\``)
            embed.setAuthor(`${message.guild.name}'s ${categoryResult.category[0].categoryName} Leaderboard`, message.guild.iconURL({ dynamic: true }))
        }
        reply += lb.join('\n\n')
        // console.log(reply.length)

        embed
            .setColor('BLUE')
            .setDescription(reply)
            .setFooter(`Page ${page}/${pageCount}`)

        message.channel.send(embed)
    }
}