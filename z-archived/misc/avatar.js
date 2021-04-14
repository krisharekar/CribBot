const Discord = require('discord.js');

module.exports = {
    commands: ['avatar', 'pfp', 'icon', 'av'],
    description: 'Shows avatar of the user',
    aliases: ['pfp', 'icon', 'av'],
    usage: '<user>',
    
    execute(message, args){

        let mentionedUser = message.mentions.users.first() || message.author

        const avatarEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`Avatar of ${mentionedUser.username}`)
        .setImage(mentionedUser.displayAvatarURL({ dynamic: true, size: 1024 }));

        message.channel.send(avatarEmbed);
        
    }
}