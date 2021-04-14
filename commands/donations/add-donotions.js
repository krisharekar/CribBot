const Discord = require('discord.js')
const donationsSchema = require('../../schemas/donations-schema')

module.exports = {
    commands: ['add-donations', 'adddonations', 'adonos', 'ad'],
    description: 'Adds or subtracts donations from a user',
    minArgs: 2,
    usage: '<user> <amount>',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args) {
        const guildId = message.guild.id
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let donationAmount = args[1]

        if (!user)
            return message.channel.send('Specify a user that exists.')

        donationAmount = donationAmount.replace(/,/g, '')
        donationAmount = abbNum(donationAmount)

        if (donationAmount.includes('e')) {
            let temp = donationAmount.split('e')
            // console.log(temp)
            donationAmount = temp[0] * Math.pow(10, temp[1])
            // console.log(donationAmount)
        }
        donationAmount = parseInt(donationAmount)

        if (isNaN(donationAmount) || donationAmount == 0)
            return message.channel.send('Donation amount must be an integer.')

        if (donationAmount % 1 != 0)
            return message.channel.send('Donation amount must be an integer.')

        const userId = user.user.id

        const result = await donationsSchema.findOneAndUpdate({ guildId, userId }, { $inc: { donationAmount } }, { upsert: true, new: true })

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Added donations to ${user.user.username}`, user.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(`**Amount Added:** \`⏣ ${donationAmount.toLocaleString()}\`
                            **Total Donations:** \`⏣ ${result.donationAmount.toLocaleString()}\``)

        message.channel.send(embed)
    }
}

function abbNum(num) {
    if (!isNaN(num)) return num;

    let number
    let temp
    let temp2

    num = num.toLowerCase()

    if (num.includes('k')) {
        temp = num.substring(0, num.indexOf('k'))
        temp2 = num.substring(num.indexOf('k')+1)
        number = parseInt(temp)*1000 + temp2
    }

    if (num.includes('m')) {
        temp = num.substring(0, num.indexOf('m'))
        temp2 = num.substring(num.indexOf('m')+1)
        number = parseInt(temp)*1000000 + temp2
    }

    if (num.includes('b')) {
        temp = num.substring(0, num.indexOf('b'))
        temp2 = num.substring(num.indexOf('b')+1)
        number = parseInt(temp)*1000000000 + temp2
    }
    // console.log(number)
    return number
}