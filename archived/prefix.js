const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    commands: ['prefix'],
    description: 'Sets prefix for the server',
    usage: '[prefix]',

    async execute(message, args, client, prefix) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.guild.name}'s Prefix`, client.user.displayAvatarURL())
                .setColor('BLUE')
                .setDescription(`**Prefix:** \`${prefix}\``)

            message.channel.send(embed)
            return;
        }
        if (!message.member.hasPermission('MANAGE_GUILD') || !message.member.hasPermission('ADMINISTRATOR'))
            return;

        const guildId = message.guild.id
        const newPrefix = args[0]

        if (newPrefix.length > 10)
            return message.channel.send('Prefix length cannot be more than 10 characters.')

        const path = './commands/misc/prefix.json'

        // console.log(fs.existsSync(path))

        const rawData = fs.readFileSync(path, 'utf-8')
        let data = JSON.parse(rawData)

        const guildData = data.find(data => data.guildId == guildId, 'utf-8')

        const newGuildData = {
            guildId,
            prefix: newPrefix
        }
        // console.log(rawData)
        // console.log(data)
        const json = JSON.stringify(newGuildData, null)
        // console.log(json)

        // console.log(data)

        // const json = JSON.stringify(newGuildData, null, 2)
        // const json = JSON.stringify(data.map(x => x.data))
        // const newData = data.push(json)

        // if(!guildData) {
        // fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
        // fs.appendFile(path, data, err => {
        //     console.log(err)
        // })
        // }

        if (guildData) {
            data = data.filter((k) => {
                return k.guildId != guildId
            })
        }

        data.push(newGuildData)

        fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name}'s Prefix Set`, client.user.displayAvatarURL())
            .setColor('GREEN')
            .setDescription(`**New Prefix Set:** \`${newPrefix}\``)

        message.channel.send(embed)

        // console.log(guildData)
        // console.log(newData)
    }
}