const Discord = require('discord.js')
const ms = require('ms')
const { GiveawaysManager } = require('discord-giveaways')

module.exports = {
    commands: ['startgiveaway', 'gstart'],
    description: 'Starts giveaway',
    usage: '<duration> <winners> <name-of-the-giveaway>',
    minArgs: 3,
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const duration = args[0]
        const winnerCount = args[1]
        const prize = args.slice(2).join(' ')

        if(isNaN(ms(duration)))
        return message.channel.send('Provide a valid amount of duration.')

        if(isNaN(winnerCount))
        return message.channel.send('Provide a vaild amount of winners.')

        client.giveawaysManager.start(message.channel, {
            time: ms(duration),
            prize: prize,
            winnerCount: winnerCount,
            hostedBy: message.author,
            messages: {
                giveaway: "🎉**GIVEAWAY**🎉",
                giveawayEnded: "🎉**GIVEAWAY ENDED**🎉",
                timeRemaining: "Time remaining: **{duration}**",
                inviteToParticipate: "React with 🎉 to enter",
                winMessage: "Congrats {winners}, you won **{prize}**",
                embedFooter: "Giveaway time!",
                noWinner: "Couldn't determine a winner",
                hostedBy: "Hosted by {user}",
                winners: "winners",
                endedAt: "Ends at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        })
    }
}