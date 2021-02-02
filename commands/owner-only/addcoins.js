const Discord = require('discord.js')

const economy = require('../economy-system/economy')

module.exports = {
    commands: ['addcoins'],
    descriptions: 'adds coins',
    ownerOnly: true,
    
    async execute(message, args){
        const target = message.mentions.users.first() || message.author
        const guildId = message.guild.id
        const userId = target.id

        if(message.author.id !== '714808648517550144')
        return message.channel.send("You can't use this command.")

        const coins = args[1] || args[0]

        if(isNaN(coins))
        return message.channel.send("Please provide a valid number of coins.")
        
        const newCoins = await economy.addCoins(guildId, userId, coins)
        
        message.channel.send(`Added ${coins} coins to ${target.username}. They now have ${newCoins} coins.`)
    }
}