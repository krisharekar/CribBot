const Canvas = require('canvas')
const { MessageAttachment } = require('discord.js')
const path = require('path')
const { getChannelId } = require('./cache/welcome-cache')

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const { guild } = member

        const channelId = getChannelId(guild.id)
        if (!channelId) {
            return
        }

        const channel = guild.channels.cache.get(channelId)
        if (!channel) {
            return
        }

        const welcomeMessage = `Welcome <@${member.user.id}> to ${guild.name}, make sure to read the rules and verify!`

        const canvas = Canvas.createCanvas(728, 305)
        const ctx = canvas.getContext('2d')

        const background = await Canvas.loadImage(
            path.join(__dirname, './images/image1.jpg')
        )
        let x = 0
        let y = 0
        ctx.drawImage(background, x, y)

        x = canvas.width / 2 - (200) / 2
        y = 8


        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 35px sans-serif'
        let text = `WELCOME ${member.user.tag}`
        let xAxis = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, xAxis, 50 + 200)

        ctx.font = 'bold 30px sans-serif'
        text = `Member #${guild.memberCount}`
        let xAxis2 = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, xAxis2, 90 + 200)

        ctx.beginPath()
        ctx.arc(x + 100, y + 100, 102, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.fill()

        ctx.beginPath();
        ctx.arc(x + 100, y + 100, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, x, y, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer())
        channel.send(welcomeMessage, attachment)
    })
}