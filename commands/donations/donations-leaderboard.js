const Discord = require('discord.js')
const { fetchLeaderboard } = require('../../assets/leaderboard')
const { computeLeaderboard } = require('../../assets/leaderboard')

module.exports = {
    commands: ['donations-leaderboard', 'donationsleaderboard', 'donos-leaderboard', 'donosleaderboard', 'donoslb', 'dlb'],
    description: 'Shows donations leaderboard of the server',
    usage: '[page]',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const page = parseInt(args[0]) || 1
        const start = (parseInt(args[0]) * 10) - 10 || 0
        const end = parseInt(args[0]) * 10 || 10

        if (isNaN(page))
            return message.channel.send('Page must be a number.')

        // const result = await donationsSchema.findOne({ guildId })

        // if (!result)
        //     return message.channel.send('The server has no donations.')

        // const { donationAmount } = result

        let reply = ''
        const rawLeaderboard = await fetchLeaderboard(guildId, start, end)
        const completeLb = await fetchLeaderboard(guildId)
        const pageCount = Math.ceil(completeLb.length/10)

        if (rawLeaderboard.length < 1 && page == 1) 
        return message.channel.send('Nobody\'s in leaderboard yet.')

        else if(rawLeaderboard.length < 1)
        return message.channel.send(`Page \`${page}\` doesnt exist.`)

        const leaderboard = await computeLeaderboard(client, rawLeaderboard, true)

        const lb = leaderboard.map(e => `**${e.position+start}.** ${e.username}#${e.discriminator}\nDonations: \`${e.donationAmount.toLocaleString()}\``)

        reply += lb.join('\n\n')

        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name}'s Leaderboard`)
            .setColor('BLUE')
            .setDescription(reply)
            .setFooter(`Page ${page}/${pageCount}`)

        message.channel.send(embed)
    }
}