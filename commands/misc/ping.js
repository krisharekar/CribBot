const Discord = require('discord.js')

module.exports = {
    commands: ['ping'],
    description: 'Shows the latency of the bot',

    async execute(message, args, client) {
        const pingEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setDescription('Checking')


        message.channel.send(pingEmbed).then(msg => {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .addFields(
                    { name: 'Bot Latency:', value: `${msg.createdTimestamp - message.createdTimestamp}ms.` },
                    { name: 'API Latency:', value: `${client.ws.ping}ms` },
                )
            msg.edit(pingEmbed)
        })
    }
}