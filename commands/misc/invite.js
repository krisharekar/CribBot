const Discord = require('discord.js')

module.exports = {
    commands: ['invite', 'link'],
    description: 'Shows the bots invite link',

    execute(message, args, client){
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Bot's links`, client.user.displayAvatarURL())
        .setColor('BLUE')
        .setDescription(`[Bot's Invite Link](https://discord.com/oauth2/authorize?client_id=744210245403934780&permissions=4294967287&scope=bot)
                        [Bot's Invite Link (admin)](https://discord.com/api/oauth2/authorize?client_id=744210245403934780&permissions=8&scope=bot)`)

        message.channel.send(embed)
    }
}