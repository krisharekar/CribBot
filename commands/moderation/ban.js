const Discord = require('discord.js');

module.exports = {
    commands: ['ban', 'b'],
    description: 'Bans a member from the server',
    aliases: ['b'],
    usage: '<user> <reason>',

    execute(message, args) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        const channel = message.guild.channels.cache.find(c => c.name.includes('logs'))

        if (!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR"))
            return message.reply('You do not have permissions to use that command.')

        if (!args[0])
            return message.reply('Mention a user to be banned.');

        if (!member)
            return message.reply('That user is not in the server.');

        if (member.id === message.author.id)
            return message.reply('Bruh, why you wanna ban yourself?')

        if (!message.member.roles.highest.position > member.roles.highest.position)
            return message.channel.send('You cannot ban a member who has higher roles than you.')

        if (member.id === '714808648517550144') {
            message.react("👌")
            message.react("😂")

            return message.channel.send(`Banned ${member}.`)
                .then(msg => {
                    setTimeout(function () {
                        msg.edit(`Banned ${member}...*jk*`)
                    }, 2000)
                })
        }

        if (!member.bannable)
            return message.reply('This user can not be banned. It is either because they are a mod/admin, or their highest role is higher than mine.');

        let reason = args.slice(1).join(" ") || 'Unspecified'

        member.ban({ reason })
            .catch(err => {
                console.log(err)
                if (err) return message.channel.send('Something went wrong.')
            })

        message.channel.send(`${member} has been banned from the server.`)


        if (!channel)
            return message.channel.reply("**TIP**: There isn't a logs channel created. You can type `>createchannel logs` to create one.")

        const banEmbed = new Discord.MessageEmbed()
            .setTitle('Member Banned')
            .setThumbnail(member.user.displayAvatarURL())
            .addField('User Banned', member)
            .addField('Banned by', message.author)
            .addField('Reason', reason)
            .setTimestamp()

        message.channel.send(banEmbed);

    }
}