const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const categorySchema = require('../../schemas/category-schema')
const { addDonationRoles } = require('../../assets/donation-roles')
const { removeDonationRoles } = require('../../assets/donation-roles')
const { abbNum } = require('../../assets/abb-num')
const getUserFromMention = require('../../assets/get-user-from-mention')

module.exports = {
    commands: ['remove-donations', 'removedonations', 'rdonos', 'rd'],
    description: 'Removes donations from a user',
    minArgs: 2,
    usage: '<user> <amount>',
    permissions: ['MANAGE_GUILD'],
    hiestAndGaw: true,

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
            .setAuthor(`Removed donations from ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')

        if (!args[2]) {
            result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount: -donationAmount, dailyDonation: -donationAmount } }, { upsert: true, new: true })

            if (result.dailyDonation < 0)
                result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { dailyDonation: 0 }, { new: true })

            if (result.donationAmount < 0)
                result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { donationAmount: 0 }, { new: true })

            embed
                .setDescription([`**Amount Removed:** \`⏣ ${donationAmount.toLocaleString()}\``,
                `**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``,
                `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``])

            msg = await message.channel.send(embed)

            client.emit('donationsMade', guildId, userId, message.author.id, 'Removed', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
        }

        else {
            const categoryId = args[2].toLowerCase()

            switch (categoryId) {
                case 'total':
                    result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount: -donationAmount } }, { upsert: true, new: true })
                    embed.setDescription([`**Amount Removed:** \`⏣ ${donationAmount.toLocaleString()}\``,
                    `**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``,
                    `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``])

                    msg = await message.channel.send(embed)
                    client.emit('donationsMade', guildId, userId, message.author.id, 'Removed', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
                    break;

                case 'today':
                case 'daily':
                    result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { dailyDonation: -donationAmount } }, { upsert: true, new: true })
                    embed.setDescription([`**Amount Removed:** \`⏣ ${donationAmount.toLocaleString()}\``,
                    `**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``,
                    `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``])

                    msg = await message.channel.send(embed)
                    client.emit('donationsMade', guildId, userId, message.author.id, 'Removed', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name)
                    break;

                default:
                    categoryResult = await categorySchema.findOne({ guildId }, { category: { $elemMatch: { categoryId } } })
                    console.log(categoryResult)

                    if (!categoryResult || !categoryResult.category.length)
                        return message.channel.send(`Category \`${categoryId}\` doesn\'t exist.`)

                    const categoryDetails = categoryResult.category[0]

                    const userResult = await donationsSchema.findOne({ guildId, userId, "category.categoryId": categoryId })
                    // console.log(userResult)

                    if (!userResult || !userResult.category.length) {
                        const obj = {
                            categoryId,
                            donationAmount: 0
                        }
                        // console.log('no result')

                        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $push: { category: obj } }, { upsert: true, new: true })
                    }

                    else
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId, "category.categoryId": categoryId }, { $inc: { "category.$.donationAmount": -donationAmount } }, { new: true })

                    let categoryDonation = result.category.find(key => key.categoryId == categoryId)

                    if (categoryDetails.addTotal)
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount: -donationAmount, dailyDonation: -donationAmount } }, { new: true })

                    if (categoryDonation.donationAmount < 0)
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId, "category.categoryId": categoryId }, { "category.$.donationAmount": 0 }, { new: true })

                    if (result.dailyDonation < 0)
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { dailyDonation: 0 }, { new: true })

                    if (result.donationAmount < 0)
                        result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { donationAmount: 0 }, { new: true })

                    categoryDonation = result.category.find(key => key.categoryId == categoryId)

                    const desc = []

                    categoryDetails.dankMemerCoins
                        ? desc.push(`**Amount Removed:** \`⏣ ${donationAmount.toLocaleString()}\``)
                        : desc.push(`**Amount Removed:** \`${donationAmount.toLocaleString()}\``)

                    categoryDetails.dankMemerCoins
                        ? desc.push(`**${categoryDetails.categoryName} Donations:** \`⏣ ${categoryDonation.donationAmount.toLocaleString()}\``)
                        : desc.push(`**${categoryDetails.categoryName} Donations:** \`${categoryDonation.donationAmount.toLocaleString()}\``)

                    if (categoryDetails.addTotal) {
                        desc.push(`**Today's Donations:** \`⏣ ${result.dailyDonation ? result.dailyDonation.toLocaleString() : '0'}\``,
                            `**Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)
                    }

                    embed.setDescription(desc)

                    msg = await message.channel.send(embed)
                    client.emit('donationsMade', guildId, userId, message.author.id, 'Removed', donationAmount, undefined, result.donationAmount, result.dailyDonation, msg.url, msg.channel.name, categoryDetails, categoryDonation.donationAmount)
                    break;
            }
        }

        await removeDonationRoles(client, guildId, userId, msg.channel.id)
        await addDonationRoles(client, guildId, userId, msg.channel.id)
    }
}