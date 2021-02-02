const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    commands: ['userinfo', 'ui', 'memberinfo', 'whois'],
    description: 'Shows info about a user',
    aliases: ['ui', 'memberinfo'],
    usage: '<user>',
    maxArgs: 1,

    execute(message, args) {
        const member = message.mentions.members.first() || message.member
        const user = message.mentions.users.first() || message.author

        let status

        if (user.presence.status == 'dnd')
            status = 'Do Not Disturb'
        if (user.presence.status == 'idle')
            status = 'Idle'
        if (user.presence.status == 'online')
            status = 'Online'
        if (user.presence.status == 'offline')
            status = 'Offline'

        const embed = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
            .setColor('RANDOM')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**❯ User Name:** ${user.tag}
            **❯ ID:** ${user.id}
            **❯ Nickname:** ${member.nickname !== null ? member.nickname : 'None'}
            **❯ Status:** ${status}
            **❯ Playing Game:** ${user.presence.game ? user.presence.game.name : 'None'}
            **❯ Bot:** ${user.bot}
            **❯ Joined The Server On:** ${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY")}
            **❯ Account Created On:** ${moment.utc(user.createdAt).format("dddd, MMMM Do YYYY")}
            **❯ Roles:** ${member.roles.cache.filter(role => role.id !== message.guild.id).map(roles => roles).join(', ')}`)
            .setFooter(`Requested by: ${user.tag}`)

        message.channel.send(embed);
    }
}