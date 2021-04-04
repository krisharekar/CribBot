const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')

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

async function fetchLeaderboard(guildId, start, end) {
    if (!guildId) throw new TypeError('A guild id was not provided.');
    // if (!start) throw new TypeError('A start limit was not provided.');
    // if (!end) throw new TypeError('A end limit was not provided.');

    const rawLb = await donationsSchema.find({ guildId }).sort([['donationAmount', 'descending']]).exec();
    // console.log(rawLb)
    if(!start && !end)
    return rawLb
    else
    return rawLb.slice(start, end);
}

async function computeLeaderboard(client, leaderboard, fetchUsers = false) {
    if (!client) throw new TypeError('A client was not provided.');
    if (!leaderboard) throw new TypeError('A leaderboard id was not provided.');

    if (leaderboard.length < 1) return [];

    const computedArray = [];

    if (fetchUsers) {
        for (const key of leaderboard) {
            // console.log(key.userId)
            const user = await client.users.fetch(key.userId) || { username: 'Unknown', discriminator: '0000' };
            computedArray.push({
                guildID: key.guildId,
                userID: key.userId,
                donationAmount: key.donationAmount,
                position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                username: user.username,
                discriminator: user.discriminator
            });
        }
    } else {
        leaderboard.map(key => computedArray.push({
            guildID: key.guildId,
            userID: key.userId,
            donationAmount: key.donationAmount,
            position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
            username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : 'Unknown',
            discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : '0000'
        }));
    }

    return computedArray;
}