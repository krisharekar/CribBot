const Discord = require('discord.js')
const prefixSchema = require('../../schemas/prefix-schema')
const { loadCache } = require('../../cache/caches/prefix-cache')

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

        await prefixSchema.findOneAndUpdate({ guildId }, { prefix: newPrefix }, { upsert: true, new: true })
        await loadCache()

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name}'s Prefix Set`, client.user.displayAvatarURL())
            .setColor('GREEN')
            .setDescription(`**New Prefix Set:** \`${newPrefix}\``)

        message.channel.send(embed)
    }
}