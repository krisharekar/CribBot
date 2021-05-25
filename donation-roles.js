const donationRolesSchema = require('./schemas/donation-roles-schema')
const donationsSchema = require('./schemas/donations-schema')

module.exports.addDonationRoles = async (client, guildId, userId) => {
    const guild = client.guilds.cache.get(guildId)
    const user = guild.members.cache.get(userId)
    const userData = await donationsSchema.findOne({ guildId, userId })
    if (!userData)
        return;
    if(!user)
    return;

    const userDonations = userData.donationAmount

    const result = await donationRolesSchema.findOne({ guildId })

    if (!result)
        return;

    for (const donationRole of result.donationRoles) {
        if (userDonations >= donationRole.donationAmount) {
            if (!user.roles.cache.has(donationRole.roleId)) {
                if (guild.roles.cache.has(donationRole.roleId)) {
                    await user.roles.add(donationRole.roleId, `Donation role added (user reached ${donationRole.donationAmount.toLocaleString()} amount of donations)`).catch(() => console.log('Couldnt add drole.'))
                }
            }
        }
    }
}

module.exports.removeDonationRoles = async (client, guildId, userId) => {
    const guild = client.guilds.cache.get(guildId)
    const user = guild.members.cache.get(userId)
    const userData = await donationsSchema.findOne({ guildId, userId })
    if (!userData)
        return;

    const userDonations = userData.donationAmount

    const result = await donationRolesSchema.findOne({ guildId })

    if (!result)
        return;

    for (const donationRole of result.donationRoles) {
        if (userDonations <= donationRole.donationAmount) {
            if (user.roles.cache.has(donationRole.roleId)) {
                await user.roles.remove(donationRole.roleId).catch(() => console.log('Couldnt remove drole.'))
            }
        }
    }
}