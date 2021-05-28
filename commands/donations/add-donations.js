const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const categorySchema = require('../../schemas/category-schema')
const { addDonationRoles } = require('../../donation-roles')
const { removeDonationRoles } = require('../../donation-roles')
const { abbNum } = require('../../assets/abb-num')
const getUserFromMention = require('../../get-user-from-mention')

module.exports = {
    commands: ['add-donations', 'adddonations', 'adonos', 'ad'],
    description: 'Adds donations to a user',
    minArgs: 2,
    usage: '<user> <amount> [category]',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0], guildId) || message.guild.members.cache.get(args[0])
        let donationAmount = args[1]

        if (!user)
            return message.channel.send('Specify a user that exists.')

        donationAmount = abbNum(donationAmount)

        if (isNaN(donationAmount) || donationAmount < 1)
            return message.channel.send('Donation amount must be an integer.')

        if (donationAmount % 1 != 0)
            return message.channel.send('Donation amount must be an integer.')

        const userId = user.user.id
        let result
        let msg

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Added donations to ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')

        if (!args[2]) {
            result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount, dailyDonation: donationAmount } }, { upsert: true, new: true })

            embed
                .setDescription([`**Amount Added:** \`⏣ ${donationAmount.toLocaleString()}\``,
                `**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``,
                `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``])

            msg = await message.channel.send(embed)
            client.emit('donationsMade', guildId, userId, message.author.id, 'Added', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
        }

        else {
            const categoryId = args[2].toLowerCase()

            switch (categoryId) {
                case 'total':
                    result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount } }, { upsert: true, new: true })
                    embed.setDescription([`**Amount Added:** \`⏣ ${donationAmount.toLocaleString()}\``,
                    `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``])

                    msg = await message.channel.send(embed)
                    client.emit('donationsMade', guildId, userId, message.author.id, 'Added', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
                    break;

                case 'today':
                case 'daily':
                    result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { dailyDonation: donationAmount } }, { upsert: true, new: true })
                    embed.setDescription([`**Amount Added:** \`⏣ ${donationAmount.toLocaleString()}\``,
                    `**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``])

                    msg = await message.channel.send(embed)
                    client.emit('donationsMade', guildId, userId, message.author.id, 'Added', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
                    break;

                default:
                    categoryResult = await categorySchema.findOne({ guildId }, { category: { $elemMatch: { categoryId } } })
                    // console.log(categoryResult)

                    if (!categoryResult || !categoryResult.category.length)
                        return message.channel.send(`Category \`${categoryId}\` doesn\'t exist.`)

                    const categoryDetails = categoryResult.category[0]

                    const userResult = await donationsSchema.findOne({ guildId, userId, "category.categoryId": categoryId })
                    // console.log(userResult)

                    if (!userResult || !userResult.category.length) {
                        const obj = {
                            categoryId,
                            donationAmount
                        }
                        // console.log('no result')

                        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $push: { category: obj } }, { upsert: true, new: true })
                    }

                    else
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId, "category.categoryId": categoryId }, { $inc: { "category.$.donationAmount": donationAmount } }, { new: true })

                    const categoryDonation = result.category.find(key => key.categoryId == categoryId)

                    if (categoryDetails.addTotal)
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount, dailyDonation: donationAmount } }, { new: true })

                    const desc = []

                    categoryDetails.dankMemerCoins
                        ? desc.push(`**Amount Added:** \`⏣ ${donationAmount.toLocaleString()}\``)
                        : desc.push(`**Amount Added:** \`${donationAmount.toLocaleString()}\``)

                    categoryDetails.dankMemerCoins
                        ? desc.push(`**${categoryDetails.categoryName} Donations:** \`⏣ ${categoryDonation.donationAmount.toLocaleString()}\``)
                        : desc.push(`**${categoryDetails.categoryName} Donations:** \`${categoryDonation.donationAmount.toLocaleString()}\``)

                    if (categoryDetails.addTotal) {
                        desc.push(`**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``,
                            `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
                    }

                    embed.setDescription(desc)

                    msg = await message.channel.send(embed)
                    client.emit('donationsMade', guildId, userId, message.author.id, 'Added', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name, categoryDetails, categoryDonation.donationAmount)
                    break;
            }
        }

        await removeDonationRoles(client, guildId, userId)
        await addDonationRoles(client, guildId, userId)
    }
}