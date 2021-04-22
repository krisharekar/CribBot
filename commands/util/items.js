const Discord = require('discord.js')
const fs = require('fs')
const { abbNum } = require('../../assets/abb-num')
const itemInfoSchema = require('../../schemas/item-info-schema')
const { getItemInfos } = require('../../cache/caches/item-info-cache')

module.exports = {
    commands: ['items', 'shop'],
    description: 'Lists the whole dank memer shop with the donation value',
    usage: '[page]',

    async execute(message, args, client) {
        const guildId = message.guild.id
        const path = './assets/items.json'
        const page = parseInt(args[0]) || 1
        const start = (page * 20) - 20 || 0
        const end = page * 20 || 20

        if (isNaN(page))
            return message.channel.send('Page number must be an integer.')

        const rawData = fs.readFileSync(path, 'utf-8')
        let data = JSON.parse(rawData)
        // console.log(data.length)
        // const regex = new RegExp(item, 'i');
        // const itemInfo = data.find(data => regex.test(data.name.replace(/\s/g, '')), 'utf-8')

        const result = getItemInfos(guildId)
        // console.log(result)

        let items = ''
        const totalPages = Math.ceil(data.length / 20)
        data = data.slice(start, end)
        if (!data.length)
            return message.channel.send(`Page \`${page.toLocaleString()}\` doesnt exist.`)
        // console.log(data[0])
        const temp = data.slice()
        const temp2 = data.slice()
        let guildItem
        const longestName = (temp.sort((a, b) => { return b.name.length - a.name.length })).slice(0, 1)[0].name.length
        const longestValue = (temp2.sort((a, b) => { return b.value - a.value })).slice(0, 1)[0].value.toLocaleString().length
        // console.log(data[0])
        console.log(longestValue)
        for (const item of data) {
            // const padString = (item) => item.padEnd((longestName+1)-item.length)+':'
            const itemName = item.name + ':'.padStart((longestName + 2) - item.name.length)
            // const value = item.name+':'.padStart((longestName+2)-item.name.length)
            // console.log(itemName, longestName+1-item.name.length)
            if (result)
                guildItem = result.find(key => key.id == item.id)
            if (guildItem) {
                // const value = guildItem.value.toLocaleString().padEnd((longestValue + 2) - guildItem.value.length)+'.'
                const value = guildItem.value.toLocaleString()+''.padStart((longestValue) - guildItem.value.toLocaleString().length)
                items += `\`${itemName}\` \`⏣ ${value}\`\n`
            }
            else {
                const value = item.value.toLocaleString()+''.padStart((longestValue) - item.value.toLocaleString().length)
                items += `\`${itemName}\` \`⏣ ${value}\`\n`

                // console.log(value)
            }
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Item List`, client.user.displayAvatarURL())
            .setColor('BLUE')
            .setDescription(items)
            .setFooter(`Page ${page}/${totalPages}`)

        message.channel.send(embed)

        // console.log(guildData)
        // console.log(newData)
    }
}

function addSpaces(string, highestLength) {
    const { length } = string
    let spaces = (highestLength + 1) - length
    let spacesString = 'a'
    for (spaces; spaces > 0; spaces--)
        spacesString += ' '
    console.log(`"${spacesString}"`)
    const newString = `\`${string}${spacesString.substring(1)}:\``
    return newString
}