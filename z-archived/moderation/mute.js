const Discord = require('discord.js')

module.exports = {
    commands: ['mute', 'm', 'shutup'],
    description: 'Mutes a user (under development)',
    aliases: ['m', 'shutup'],
    usage: '<user>',
    minArgs: 1,
    permissions: ['KICK_MEMBERS' || 'BAN_MEMBERS'],

    async execute(message, args) {

        const { guild } = message

        if (args[0] === 'createrole' && !mutedRole) {

            await guild.roles.create({
                data: {
                    name: 'Muted',
                    color: 'GREY',
                },
                reason: 'User has been muted.',
            })

            let mutedRole = guild.roles.cache.find((role) => {
                return role.name === 'Muted'
            });

            message.guild.channels.cache.forEach(async channel => {
                if (channel.type == "text")
                    await channel.overwritePermissions([
                        {
                            id: mutedRole.id,
                            deny: ['SEND_MESSAGES'],
                        },
                    ])
            })
            return message.channel.send("Successfully created a 'Muted' role.")
        }

        var mutedRole = guild.roles.cache.find((role) => {
            return role.name === 'Muted'
        });

        if (!message.member.hasPermission("KICK_MEMBERS" || "ADMINISTRATOR"))
            return message.reply("You do not have permissions to use this command.")

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);


        if (!mutedRole)
            return message.channel.send("'Muted' role has not been created yet. Type `>mute createrole` to create a 'Muted' role.")

        if (!args[0])
            return message.reply('Mention a user to be muted.');

        if (!member)
            return message.reply('That user is not in the server.');

        if (member.id === message.author.id)
            return message.reply('Bruh, why you wanna mute yourself?')

        if (message.member.roles.highest.position < member.roles.highest.position)
            return message.channel.send('You cannot mute a member who has a higher role than you.')

        if (!member.kickable)
            return message.channel.send('This user can not be muted. It is either because they are a mod/admin, or their highest role is higher than mine.');

        let reason = args.slice(1).join(" ") || 'Unspecified'

        const targetUser = guild.members.cache.get(member.id)
        if (targetUser.roles.cache.get(mutedRole.id)) {
            message.reply(`That user is already is muted.`)
        }
        else if (!targetUser.roles.cache.get(mutedRole.id)) {
            member.roles.add(mutedRole)

            message.channel.send(`${targetUser} has been muted.`)
                .catch(err => {
                    console.log(err)
                    if (err) return message.channel.send('Something went wrong.')
                })

            /*const muteEmbed = new Discord.MessageEmbed() 
            .setTitle('Member Muted')
            .setThumbnail(member.user.displayAvatarURL())
            .addField('User Muted', targetUser)
            .addField('Muted by', message.author)
            .addField('Reason', reason)
            .setTimestamp()
    
            message.channel.send(muteEmbed);*/
        }
    }
}