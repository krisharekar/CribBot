const Discord = require('discord.js')
const donationsSchema = require('./schemas/donations-schema')
const { getDonationsChannel } = require('./cache/caches/donations-channel-cache')
const { getHighestDonorChannel } = require('./cache/caches/highest-donor-channel-cache')

module.exports = (client) => {
    client.on('message', async message => {
        const channelId = getDonationsChannel(message.guild.id)
        if (!channelId || !channelId.includes(message.channel.id))
            return;
        if (message.author.id != '270904126974590976')
            return;

        const { content } = message
        if (!content.includes('You gave') || !content.includes('⏣')) //tax
            return;

        // console.log(content)
        // return;

        const userId = message.mentions.users.first().id
        const guildId = message.guild.id
        const temp = (content.substring(content.indexOf('⏣') + 2))
        // console.log(temp)
        const donationAmount = parseInt(temp.substring(0, temp.indexOf('*')).replace(/,/g, ''))
        // console.log(donationAmount)

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount } }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Thank you for your donation ${message.mentions.users.first().tag}`, message.mentions.users.first().displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .setDescription(`**Amount Donated:** \`⏣ ${donationAmount.toLocaleString()}\`
        **Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
            .setFooter('If this information was incorrect, report it to Krish')

        message.channel.send(embed)

        // await updateHighestDonorChannel(client, guildId)
    })
}


async function fetchLeaderboard(guildId, limit) {
    if (!guildId) throw new TypeError('A guild id was not provided.');
    if (!limit) throw new TypeError('A limit was not provided.');

    const rawLb = await donationsSchema.find({ guildId }).sort([['donationAmount', 'descending']]).exec();
    // console.log(rawLb)
    return rawLb.slice(0, limit);
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

function abbNum(num) {
    if (isNaN(num)) return num;

    if (num < 9999) {
        return num;
    }

    if (num < 1000000) {
        return Math.floor(num / 1000) + "K";
    }
    if (num < 10000000) {
        return (num / 1000000).toFixed(2) + "M";
    }

    if (num < 1000000000) {
        return Math.floor((num / 1000000)) + "M";
    }

    if (num < 1000000000000) {
        return Math.floor((num / 1000000000)) + "B";
    }

    return "1T+";
}

module.exports.updateHighestDonorChannel = async (client, guildId) => {
    const highestDonorChannelId = getHighestDonorChannel(guildId)

    if (!highestDonorChannelId)
        return;

    const highestDonorChannel = client.guilds.cache.get(guildId).channels.cache.get(highestDonorChannelId)
    // console.log(highestDonorChannel.name)
    if(!highestDonorChannel)
    return;

    const rawLeaderboard = await fetchLeaderboard(guildId, 1)

    if (rawLeaderboard.length < 1)
        return;

    const leaderboard = await computeLeaderboard(client, rawLeaderboard, true)

    const highestDonor = leaderboard[0].username
    const highestAmount = abbNum(leaderboard[0].donationAmount)
    // console.log(leaderboard[0].donationAmount)
    // console.log(highestAmount)

    await highestDonorChannel.edit({ name: `${highestDonor} (${highestAmount})` }).catch(e => console.log(e))
    console.log(`${highestDonor} (${highestAmount})`)
}

// async function updateHighestDonorChannel (client, guildId) {
//     const highestDonorChannelId = getHighestDonorChannel(guildId)

//     if (!highestDonorChannelId)
//         return;

//     const highestDonorChannel = client.guilds.cache.get(guildId).channels.cache.get(highestDonorChannelId)
//     // console.log(highestDonorChannel)
//     if(!highestDonorChannel)
//     return;

//     const rawLeaderboard = await fetchLeaderboard(guildId, 1)

//     if (rawLeaderboard.length < 1)
//         return;

//     const leaderboard = await computeLeaderboard(client, rawLeaderboard, true)

//     const highestDonor = leaderboard[0].username
//     const highestAmount = abbNum(leaderboard[0].donationAmount)
//     // console.log(leaderboard[0].donationAmount)

//     await highestDonorChannel.edit({ name: `${highestDonor} (${highestAmount})` }).catch(e => console.log(e))
//     // console.log(`${highestDonor} (${highestAmount})`)
// }