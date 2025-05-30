const { getHighestDonorChannel } = require('../cache/caches/highest-donor-channel-cache')
const { fetchLeaderboard } = require('./leaderboard')
const { computeLeaderboard } = require('./leaderboard')

module.exports = async (client, guildId) => {
    if (guildId) {
        updateHighestDonorChannel(client, guildId)
    }
    if (!guildId) {
        setInterval(() => {
            client.guilds.cache.forEach(async g => {
                updateHighestDonorChannel(client, g.id)
            })
        }, 5 * 60 * 1000)
    }
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
        return (num / 1000000000).toFixed(9).slice(0, -8) + "B";
    }

    return "1T+";
}

async function updateHighestDonorChannel(client, guildId) {
    const highestDonorChannelId = getHighestDonorChannel(guildId)

    if (!highestDonorChannelId)
        return;

    const highestDonorChannel = client.guilds.cache.get(guildId).channels.cache.get(highestDonorChannelId)
    // console.log(highestDonorChannel.name)
    if (!highestDonorChannel)
        return;

    const rawLeaderboard = await fetchLeaderboard(guildId, 'total', client)

    if (rawLeaderboard.length < 1)
        return;

    const leaderboard = await computeLeaderboard(client, rawLeaderboard, true)

    const highestDonor = leaderboard[0].username
    const highestAmount = abbNum(leaderboard[0].donationAmount)
    // console.log(leaderboard[0].donationAmount)
    // console.log(highestAmount)

    await highestDonorChannel.edit({ name: `${highestDonor} (${highestAmount})` }).catch()
}