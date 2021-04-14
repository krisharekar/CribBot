const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    commands: ['value', 'v'],
    description: 'Shows donation value of an item',
    minArgs: 1,
    usage: '<item> [amount]',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const item = args[0]
        const amount = parseInt(args[1]) || 1

        if(item.length < 2)
        return message.channel.send(`Item \`${item}\` not found.`)

        if(amount < 1)
        message.channel.send('Amount cannot be less than 1.')

        const path = './assets/items.json'

        const rawData = fs.readFileSync(path, 'utf-8')
        let data = JSON.parse(rawData)
        // console.log(data.length)
        const regex = new RegExp(item, 'i');
        const itemInfo = data.find(data => regex.test(data.name.replace(/\s/g, '')), 'utf-8')

        if(!itemInfo)
        return message.channel.send(`Item \`${item}\` not found.`)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${itemInfo.name}'s Value`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .setThumbnail(itemInfo.link)
            .setDescription(`**Donation Value:** \`⏣ ${(itemInfo.value*amount).toLocaleString()}\``)

        message.channel.send(embed)

        // console.log(guildData)
        // console.log(newData)
    }
}