const Discord = require('discord.js');

module.exports = {
    commands: ['kick', 'k'],
    description: 'Kicks a member from the server',
    aliases: ['k'],
	usage: '<user> [reason]',
    minArgs: 1,
    permissions: ['KICK_MEMBERS'],

    execute(message, args){

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!message.member.hasPermission("KICK_MEMBERS" || "ADMINISTRATOR"))
        return message.reply('You do not have permissions to use that command.')

        if(!args[0])
        return message.reply('Mention a user to be kicked.');

        if(!member) 
        return message.reply('That user is not in the server.');

        if(member.id === message.author.id)
        return message.reply('Bruh, why you wanna kick yourself?');

        if(member.id === '714808648517550144'){
            message.react("👌")
            message.react("😂")

            return message.channel.send(`Kicked ${member}.`)
            .then(msg => {
                setTimeout(function(){
                  msg.edit(`Kicked ${member}...*jk*`)
                }, 2000)
            })
        }
        
        if(message.member.roles.highest.position < member.roles.highest.position)
        return message.channel.send('You cannot kick a member who has a higher role than you.')
        
        if(!member.kickable) 
        return message.reply('This user can not be kicked. It is either because they are a mod/admin, or their highest role is higher than mine.');

        let reason = args.slice(1).join(" ") || 'Unspecified'

        member.kick({reason})
        .catch(err => {
            console.log(err)
            if(err) return message.channel.send('Something went wrong.')})

            message.channel.send(`${member} has been kicked from the server.`)

        /*const kickEmbed = new Discord.MessageEmbed() 
        .setTitle('Member Kicked')
        .setThumbnail(member.user.displayAvatarURL())
        .addField('User Kicked', member)
        .addField('Kicked by', message.author)
        .addField('Reason', reason)
        .setTimestamp()

        message.channel.send(kickEmbed);*/
        
    }
}