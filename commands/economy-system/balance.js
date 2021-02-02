const Discord = require('discord.js');

const economy = require('./economy')

module.exports = {
    commands: ['balance', 'bal'],
    description: 'Shows balance of a user',
    aliases: ['bal'],
    cooldown: 5,
    
    async execute(message, args){

        const target = message.mentions.users.first() || message.author
        const targetId = target.id

        const guildId = message.guild.id
        const userId = target.id
        
        const coins = await economy.getCoins(guildId, userId)

        const balanceEmbed = new Discord.MessageEmbed()
        .setTitle(`${target.username}'s balance`)
        .setColor('RANDOM')
        .setDescription(`**Wallet:** ${coins}`)
        .setTimestamp()

        message.channel.send(balanceEmbed)
    }
}
