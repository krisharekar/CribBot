const donationRolesSchema = require('../schemas/donation-roles-schema')
const donationsSchema = require('../schemas/donations-schema')

module.exports.addDonationRoles = async (client, guildId, userId, channelId) => {
    const guild = client.guilds.cache.get(guildId)
    const user = guild.members.cache.get(userId)
    const channel = guild.channels.cache.get(channelId)
    const userData = await donationsSchema.findOne({ guildId, userId })
    if (!userData)
        return;
    if (!user)
        return;

    const userDonations = userData.donationAmount

    const result = await donationRolesSchema.findOne({ guildId })

    if (!result)
        return;

    let reason
    const rolesGiven = []
    const rolesError = []

    for (const donationRole of result.donationRoles) {
        if (userDonations >= donationRole.donationAmount) {
            if (guild.roles.cache.has(donationRole.roleId)) {
                if (!user.roles.cache.has(donationRole.roleId)) {
                    let error
                    reason = `Donation role added (user reached ${donationRole.donationAmount.toLocaleString()} amount of donations)`
                    await user.roles.add(donationRole.roleId, reason).catch(() => error = true)
                    const role = guild.roles.cache.get(donationRole.roleId)
                    console.gl  
                    error
                        ? rolesError.push(role.name)
                        : rolesGiven.push(role.name)
                }
            }
        }
    }

    let rolesGivenText = '', rolesErrorText = ''

    if (rolesGiven.length)
        rolesGivenText = `Donation ` + (rolesGiven.length == 1 ? `Role` : `Roles`) + ` given to **${user.user.tag}**: \`${rolesGiven.join(', ')}\``

    if (rolesError.length)
        rolesErrorText = `Donation ` + (rolesError.length == 1 ? `Role` : `Roles`) + ` that couldn\'t be given to **${user.user.tag}** due to role hierarchy: \`${rolesError.join(', ')}\``

    if (rolesGivenText || rolesErrorText)
        channel.send(`${rolesGivenText}\n${rolesErrorText}`)
}

module.exports.removeDonationRoles = async (client, guildId, userId, channelId) => {
    const guild = client.guilds.cache.get(guildId)
    const user = guild.members.cache.get(userId)
    const channel = guild.channels.cache.get(channelId)
    const userData = await donationsSchema.findOne({ guildId, userId })
    if (!userData)
        return;

    const userDonations = userData.donationAmount

    const result = await donationRolesSchema.findOne({ guildId })

    if (!result)
        return;

    const rolesRemoved = []
    const rolesError = []

    for (const donationRole of result.donationRoles) {
        if (userDonations < donationRole.donationAmount) {
            if (user.roles.cache.has(donationRole.roleId)) {
                let error
                await user.roles.remove(donationRole.roleId).catch(() => error = true)
                const role = guild.roles.cache.get(donationRole.roleId)
                error
                    ? rolesError.push(role.name)
                    : rolesRemoved.push(role.name)
            }
        }
    }

    let rolesRemovedText = '', rolesErrorText = ''

    if (rolesRemoved.length)
        rolesRemovedText = `Donation ` + (rolesRemoved.length == 1 ? `Role` : `Roles`) + ` removed from **${user.user.tag}**: \`${rolesRemoved.join(', ')}\``

    if (rolesError.length)
        rolesErrorText = `Donation ` + (rolesError.length == 1 ? `Role` : `Roles`) + ` that couldn\'t be removed from **${user.user.tag}** due to role hierarchy: \`${rolesError.join(', ')}\``

    if (rolesRemovedText || rolesErrorText)
        channel.send(`${rolesRemovedText}\n${rolesErrorText}`)
}