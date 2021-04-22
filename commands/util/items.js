const Discord = require('discord.js')
const fs = require('fs')
const { abbNum } = require('../../assets/abb-num')
const itemInfoSchema = require('../../schemas/item-info-schema')
const { getItemInfos } = require('../../cache/caches/item-info-cache')

module.exports = {
    commands: ['items', 'shop'],
    description: 'Lists the whole dank memer shop with the donation value',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const path = './assets/items.json'

        const rawData = fs.readFileSync(path, 'utf-8')
        let data = JSON.parse(rawData)
        // console.log(data.length)
        // const regex = new RegExp(item, 'i');
        // const itemInfo = data.find(data => regex.test(data.name.replace(/\s/g, '')), 'utf-8')

        const result = getItemInfos(guildId)
        // console.log(result)

        let items = ''
        let values = ''
        data = data.slice(0, 25)
        let guildItem

        for (const item of data) {
            if(result)
            guildItem = result.find(key => key.id == item.id)
            if (guildItem) {
                items += `${item.name}: \`⏣ ${guildItem.value.toLocaleString()}\`\n`
                values += `\`⏣ ${guildItem.value.toLocaleString()}\`\n`
            }
            else {
                items += `${item.name}: \`⏣ ${item.value.toLocaleString()}\`\n`
                values += `\`⏣ ${item.value.toLocaleString()}\`\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Item List`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(items)
            // .addField('Donation Value', values, true)

        message.channel.send(embed)

        // console.log(guildData)
        // console.log(newData)
    }
}