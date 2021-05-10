const Discord = require('discord.js')
const { fetchLeaderboard } = require('../../assets/leaderboard')
const { computeLeaderboard } = require('../../assets/leaderboard')

module.exports = {
    commands: ['donations-leaderboard', 'donationsleaderboard', 'donos-leaderboard', 'donosleaderboard', 'donoslb', 'dlb'],
    description: 'Shows donations leaderboard of the server',
    minArgs: 1,
    usage: '<total/daily> [page]',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const lbName = args[0]
        const page = parseInt(args[1]) || 1
        const start = (parseInt(args[1]) * 10) - 10 || 0
        const end = parseInt(args[1]) * 10 || 10

        if(lbName != 'total' && lbName != 'daily')
        return message.channel.send('Second argument must be either `total` or `daily`')

        if (isNaN(page))
            return message.channel.send('Page must be a number.')

        // const result = await donationsSchema.findOne({ guildId })

        // if (!result)
        //     return message.channel.send('The server has no donations.')

        // const { donationAmount } = result

        let reply = ''
        const rawLeaderboard = await fetchLeaderboard(guildId, lbName, start, end)
        const completeLb = await fetchLeaderboard(guildId, lbName)
        const pageCount = Math.ceil(completeLb.length/10)

        if (rawLeaderboard.length < 1 && page == 1) 
        return message.channel.send('Nobody\'s in leaderboard yet.')

        else if(rawLeaderboard.length < 1)
        return message.channel.send(`Page \`${page}\` doesnt exist.`)

        const leaderboard = await computeLeaderboard(client, rawLeaderboard, true)

        let lb

        if(lbName == 'total')
        lb = leaderboard.map(e => `**${e.position+start}.** ${e.username}#${e.discriminator}\n**Total Donations:** \`⏣ ${e.donationAmount.toLocaleString()}\``)

        if(lbName == 'daily')
        lb = leaderboard.map(e => `**${e.position+start}.** ${e.username}#${e.discriminator}\n**Today's Donations:** \`⏣ ${e.dailyDonation ? e.dailyDonation.toLocaleString() : '0'}\``)

        reply += lb.join('\n\n')
        // console.log(reply.length)

        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name}'s Leaderboard`)
            .setColor('BLUE')
            .setDescription(reply)
            .setFooter(`Page ${page}/${pageCount}`)

        message.channel.send(embed)
    }
}