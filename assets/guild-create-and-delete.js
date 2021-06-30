const Discord = require('discord.js')

module.exports = (client) => {
    const logChannel = client.channels.cache.get('842730351386427452')
    client.on('guildCreate', guild => {
        const embed = embedBuilder(client, guild, 'added')
        logChannel.send(embed)
    })
    client.on('guildDelete', guild => {
        const embed = embedBuilder(client, guild, 'removed')
        logChannel.send(embed)
    })
}

function embedBuilder(client, guild, type) {
    const memberCount = guild.members.cache.size
    const humanCount = guild.members.cache.filter(u => !u.user.bot).size
    const botCount = guild.members.cache.filter(u => u.user.bot).size
    const embed = new Discord.MessageEmbed()
        .setAuthor(type == 'added' ? 'Bot Added' : 'Bot Removed', client.user.displayAvatarURL())
        .setColor(type == 'added' ? 'GREEN' : 'RED')
        .setThumbnail(guild.iconURL())
        .addField('Server Name', guild.name)
        .addField('Server Owner', guild.owner ? `${guild.owner.user.tag} (${guild.owner.user.id})` : '')
        .addField('Member Count', `Total: ${memberCount}\nHumans: ${humanCount}\nBots: ${botCount}`)
    // .addField('Member Count', memberCount)
    // .addField('Human Count', humanCount)
    // .addField('Bot Count', botCount)

    return embed
}