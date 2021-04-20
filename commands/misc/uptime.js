const moment = require('moment')
require('moment-duration-format')

const Discord = require('discord.js')

module.exports = {
    commands: ['uptime'],
    description: 'Shows how long the bot has been up',

    execute(message, args, client){
        const uptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]')

        message.channel.send(`Bot has been up for \`${uptime}\``)
    }
}