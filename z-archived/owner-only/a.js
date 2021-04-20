/*const Discord = require('discord.js')

module.exports = {
    commands: ['hi'],
    description: 'ok',

    execute(message, args){
        member = message.mentions.users.first() || message.author

        if(!message.member.hasPermission('KICK_MEMBERS' || 'ADMINISTRATOR'))
        return message.channel.send("You don't have permission to use this command.")

        const mutedRole = message.guild.rols.cache.find(role => role.name === 'Muted')

        if(!mutedRole)
        return message.channel.send("There isn't a muted role created, type `>createrole Muted` to create one.")

        const time = args[1]

        if(!time)
        return message.channel.send("Specify the amount of time you want to temp-mute someone.")

        let reason = args[1].shift().join(' ')

        if(!reason)
        let reason = 'Unspecified'

        member.roles.add(mutedRole)

        setTimeout(function(){
            member.roles.remove(mutedRole)
        }, (time))
    }
}*/