const donationsSchema = require('../schemas/donations-schema')

module.exports.fetchLeaderboard = async (guildId, lbName, start, end) => {
    if (!guildId) throw new TypeError('A guild id was not provided.');
    if (!lbName) throw new TypeError('Leaderboard name was not provided.');

    let rawLb

    if(lbName == 'total')
    rawLb = await donationsSchema.find({ guildId }).sort([['donationAmount', 'descending']]).exec();

    else if (lbName == 'daily')
    rawLb = await donationsSchema.find({ guildId }).sort([['dailyDonation', 'descending']]).exec();

    if (end)
    rawLb = rawLb.slice(start, end)

    lbName == 'total' ? rawLb = rawLb.filter(key => key.donationAmount > 0) : rawLb = rawLb.filter(key => key.dailyDonation > 0)

    return rawLb
}

module.exports.computeLeaderboard = async (client, leaderboard, fetchUsers = false) => {
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
                dailyDonation: key.dailyDonation,
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
            dailyDonation: key.dailyDonation,
            position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
            username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : 'Unknown',
            discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : '0000'
        }));
    }

    return computedArray;
}