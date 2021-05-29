const Discord = require('discord.js')
const fs = require('fs')
const itemInfoSchema = require('../../schemas/item-info-schema')
const { abbNum } = require('../../assets/abb-num')
const { loadCache } = require('../../cache/caches/item-info-cache')

module.exports = {
    commands: ['set-value', 'setvalue', 'sv'],
    description: 'Sets donation value of an item of the server',
    minArgs: 2,
    usage: '<item> <value>',
    permissions: ['ADMINISTRATOR'],

    async execute(message, args, client) {
        const guildId = message.guild.id
        const item = args[0]
        const amount = abbNum(args[1])

        if (item.length < 2)
            return message.channel.send(`Item \`${item}\` not found.`)

        const path = './assets/items.json'

        const rawData = fs.readFileSync(path, 'utf-8')
        let data = JSON.parse(rawData)
        // console.log(data.length)
        const regex = new RegExp(item, 'i');
        const itemInfo = data.find(data => regex.test(data.name.replace(/\s/g, '')), 'utf-8')

        if (!itemInfo)
            itemInfo = data.find(data => regex.test(data.name.replace(/[\s']/g, '')), 'utf-8')

        if (!itemInfo)
            return message.channel.send(`Item \`${item}\` not found.`)

        if (isNaN(amount))
            return message.channel.send('Value must be an integer.')

        if (amount < 1)
            return message.channel.send('Value cannot be less than 1.')

        const newItemInfo = {
            id: itemInfo.id,
            value: amount
        }

        const result = await itemInfoSchema.findOne({ guildId })
        let exists = false
        let oldValue

        if (result) {
            for (const guildItemInfo of result.itemInfos) {
                if (guildItemInfo.id == itemInfo.id) {
                    await itemInfoSchema.findOneAndUpdate({ guildId }, { $pull: { itemInfos: guildItemInfo } })
                    oldValue = guildItemInfo.value
                    exists = true
                }
            }
        }
        await itemInfoSchema.findOneAndUpdate({ guildId }, { $push: { itemInfos: newItemInfo } }, { upsert: true })

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${itemInfo.name}'s New Value`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .setThumbnail(itemInfo.link)

        if (exists)
            embed.setDescription(`**Old Donation Value:** \`⏣ ${(oldValue).toLocaleString()}\`\n**New Donation Value:** \`⏣ ${(newItemInfo.value).toLocaleString()}\``)

        else
            embed.setDescription(`**Old Donation Value:** \`⏣ ${(itemInfo.value).toLocaleString()}\`\n**New Donation Value:** \`⏣ ${(newItemInfo.value).toLocaleString()}\``)

        message.channel.send(embed)
        loadCache(guildId)
    }
}