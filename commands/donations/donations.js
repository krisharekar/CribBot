const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const categorySchema = require('../../schemas/category-schema')
const getUserFromMention = require('../../assets/get-user-from-mention')

module.exports = {
    commands: ['donations', 'donos'],
    description: 'Shows donations of a user',
    usage: '<user>',
    minArgs: 1,
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const user = getUserFromMention(args[0], guildId) || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send('Mention a user that exists.')

        const userId = user.user.id

        let result = await donationsSchema.findOne({ guildId, userId })

        let donationAmount, dailyDonation

        if (result) {
            donationAmount = result.donationAmount
            dailyDonation = result.dailyDonation
        }

        const categoryResult = await categorySchema.findOne({ guildId })
        const desc = []

        desc.push(`**Today's Donations:** \`⏣ ${dailyDonation ? dailyDonation.toLocaleString() : '0'}\``)

        // else {
        //     desc.push(`**Total Donations:** \`⏣ 0\``)
        //     desc.push(`**Today's Donations:** \`⏣ 0\``)
        // }

        if (categoryResult) {
            for (const category of categoryResult.category) {
                let userCategory
                if (result)
                    userCategory = result.category.find(key => key.categoryId == category.categoryId)
                console.log(userCategory)

                if (category.dankMemerCoins)
                    desc.push(`**${category.categoryName} Donations:** \`⏣ ${userCategory ? userCategory.donationAmount.toLocaleString() : '0'}\``)
                else
                    desc.push(`**${category.categoryName} Donations:** \`${userCategory ? userCategory.donationAmount.toLocaleString() : '0'}\``)
            }
        }

        desc.push(`**Total Donations:** \`⏣ ${donationAmount ? donationAmount.toLocaleString() : '0'}\``)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Donations of ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(desc)

        message.channel.send(embed)
    }
}