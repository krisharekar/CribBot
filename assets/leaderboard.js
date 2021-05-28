const donationsSchema = require('../schemas/donations-schema')

module.exports.fetchLeaderboard = async (guildId, lbName) => {
    if (!guildId) throw new TypeError('A guild id was not provided.');
    if (!lbName) throw new TypeError('Leaderboard name was not provided.');

    let rawLb
    // rawLb = await donationsSchema.find({ guildId, "category.categoryId": 'owo' }).sort([['category.donationAmount', 'descending']])
    // console.log(rawLb.category.filter(key => key.categoryId == lbName))
    // return

    switch (lbName) {
        case 'total':
            rawLb = await donationsSchema.find({ guildId }).sort([['donationAmount', 'descending']]).exec();
            rawLb = rawLb.filter(key => key.donationAmount > 0)
            break;

        case 'daily':
            rawLb = await donationsSchema.find({ guildId }).sort([['dailyDonation', 'descending']]).exec();
            console.log(rawLb)
            rawLb = rawLb.filter(key => key.dailyDonation > 0)
            break;

        default:
            rawLb = await donationsSchema.find({ guildId, "category.categoryId": lbName })
            let newLb = []
            // rawLb.forEach(k => { 
            //     let obj = k.category.filter(key => { return key.categoryId == lbName })[0]
            //     obj.userId = k.userId
            //     newLb.push(obj)
            // })
            // rawLb = newLb
            // console.log(rawLb)
            rawLb = rawLb.sort((a, b) => b.category.find(k => k.categoryId == lbName).donationAmount - a.category.find(k => k.categoryId == lbName).donationAmount)
            // console.log(newLb)
            rawLb = rawLb.filter(key => key.category.find(c => c.categoryId == lbName).donationAmount > 0)
            break;
    }

    return rawLb
}

module.exports.computeLeaderboard = async (client, leaderboard, fetchUsers = false, lbName) => {
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
                categoryDonation: key.category.find(c => c.categoryId == lbName) ? key.category.find(c => c.categoryId == lbName).donationAmount : '0',
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
            categoryDonation: key.category.find(c => c.categoryId == lbName) ? key.category.find(c => c.categoryId == lbName).donationAmount : '0',
            position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
            username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : 'Unknown',
            discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : '0000'
        }));
    }

    return computedArray;
}