const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')
const categorySchema = require('../../schemas/category-schema')
const getUserFromMention = require('../../assets/get-user-from-mention')

module.exports = {
    commands: ['my-donations', 'mydonations', 'my-donos', 'mydonos', 'myd'],
    description: 'Shows donations of the author',

    async execute(message, args) {
        const guildId = message.guild.id
        const user = message.member

        const userId = user.user.id

        let result = await donationsSchema.findOne({ guildId, userId })

        const { donationAmount, dailyDonation } = result

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

        desc.push(`**Total Donations:** \`⏣ ${donationAmount ? donationAmount.toLocaleString(): '0'}\``)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Donations of ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(desc)

        message.channel.send(embed)
    }
}