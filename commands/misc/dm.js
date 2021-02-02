const Discord = require('discord.js')

module.exports = {
    commands: ['dm'],
    description: 'Pretty useless command just to dm a user by taking a LONG CUT',
    aliases: ['message', 'directmessage'],
    usage: '<user> <message>',
    args: true,
    guildOnly: true,  

    execute(message, args){

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if(!member)
        return message.reply("Mention a user to dm.")

        // if(member.id === message.author.id)
        //     return message.reply("You must be stupid for trying to dm yourself.")

        const msg = args.slice(1).join(' ')

        const dmEmbed = new Discord.MessageEmbed()
        .setTitle("You have a new DM.")
        .setColor('BLUE')
        .addField(`Message from ${message.author.username}.`, msg)
        .setTimestamp()
        
        member.send(dmEmbed)
        .catch(err => {
            if(err)
            return message.channel.send(`${member.username} has closed there dms.`)
        })
        message.channel.send(`Succesfully dmed ${member}`)
    }
}