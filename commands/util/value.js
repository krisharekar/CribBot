const Discord = require('discord.js')
const fs = require('fs')
const { abbNum } = require('../../assets/abb-num')
const itemInfoSchema = require('../../schemas/item-info-schema')
const { getItemInfos } = require('../../cache/caches/item-info-cache')
const { prefixFinder } = require('../../prefix-finder')

module.exports = {
    commands: ['value', 'v'],
    description: 'Shows donation value of an item',
    minArgs: 1,
    usage: '<item> [amount]',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const prefix = prefixFinder(guildId)
        const item = args[0]
        let amount = args[1] || 1

        amount = abbNum(amount)

        if(item.length < 2)
        return message.channel.send(`Item \`${item}\` not found.`)

        const path = './assets/items.json'

        const rawData = fs.readFileSync(path, 'utf-8')
        let data = JSON.parse(rawData)
        // console.log(data.length)
        const regex = new RegExp(item, 'i');
        const itemInfo = data.find(data => regex.test(data.name.replace(/\s/g, '')), 'utf-8')

        if(!itemInfo)
        return message.channel.send(`Item \`${item}\` not found.`)

        if(isNaN(amount))
        return message.channel.send('Amount must be an integer.')

        if(amount < 1)
        return message.channel.send('Amount cannot be less than 1.')

        const result = getItemInfos(guildId)
        // console.log(result)

        let embed = new Discord.MessageEmbed()
        .setAuthor(`${itemInfo.name}'s Value`, client.user.displayAvatarURL())
        .setColor('BLUE')
        .setThumbnail(itemInfo.link)
        .setFooter(`Change the value by using ${prefix}set-value`)

        let value = itemInfo.value

        if(result) {
            for (const guildItemInfo of result) {
                if(guildItemInfo.id == itemInfo.id)
                value = guildItemInfo.value
            }
        }

        if(amount == 1)
        embed.setDescription(`**Donation Value:** \`⏣ ${(value).toLocaleString()}\``)

        else
        embed.setDescription(`**Donation Value:** \`⏣ ${(value*amount).toLocaleString()}\`\n**Donation Value of 1 item:** \`⏣ ${(value).toLocaleString()}\``)

        message.channel.send(embed)

        // console.log(guildData)
        // console.log(newData)
    }
}