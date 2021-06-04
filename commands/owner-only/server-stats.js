const Discord = require('discord.js')

module.exports = {
    commands: ['server-stats', 'serverstats', 'ss'],
    minArgs: 1,
    usage: '<guild-id>',
    ownerOnly: true,

    async execute(message, args, client) {
        const guild = client.guilds.cache.get(args[0])

        if (!guild)
            return message.channel.send(`Guild \`${args[0]}\` doesn\'t exist.`)

        const memberCount = guild.members.cache.size
        const humanCount = guild.members.cache.filter(u => !u.user.bot).size
        const botCount = guild.members.cache.filter(u => u.user.bot).size
        const embed = new Discord.MessageEmbed()
            .setAuthor('Server Stats', client.user.displayAvatarURL())
            .setColor('BLUE')
            .setThumbnail(guild.iconURL())
            .addField('Server Name', guild.name)
            .addField('Server Owner', `${guild.owner.user.tag} (${guild.owner.user.id})`)
            .addField('Member Count', `Total: ${memberCount}\nHumans: ${humanCount}\nBots: ${botCount}`)

        message.channel.send(embed)
    }
}