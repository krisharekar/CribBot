const Discord = require('discord.js')
const { abbNum } = require('../../assets/abb-num')
const { taxCalc } = require('../../assets/tax-calculator')

module.exports = {
    commands: ['tax-calculator', 'taxcalculator', 'taxcalc', 'tc'],
    description: 'Calculates tax according to dank memer tax rate',
    usage: '<amount>',
    minArgs: 1,

    async execute(message, args) {
        let amount = args[0]

        amount = abbNum(amount)

        if(isNaN(amount) || amount < 1)
        return message.channel.send('Amount must be an integer.')

        const result = taxCalc(amount)

        const { amountLost, amountRecieved, amountToBePaid } = result

        const embed = new Discord.MessageEmbed()
        .setAuthor('Tax Calculator')
        .setColor('BLUE')
        .setDescription([`**Amount user recieves:** \`⏣ ${amountRecieved.toLocaleString()}\``,
                        `**Amount lost due to tax:** \`⏣ ${amountLost.toLocaleString()}\``,
                        `**Amount to be paid to cover tax:** \`⏣ ${amountToBePaid.toLocaleString()}\``])
        .setFooter('Tax Rate: 8%')

        message.channel.send(embed)
    }
}