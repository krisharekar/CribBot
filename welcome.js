const Canvas = require('canvas')
const { MessageAttachment } = require('discord.js')
const path = require('path')
const { getChannelId } = require('./cache/caches/welcome-cache')

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

        const welcomeImages = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg']

        const welcomeMessage = `Welcome <@${member.user.id}> to ${guild.name}, make sure to read the rules and verify!`

        // Canvas.registerFont('../../../AppData/Local/Microsoft/Windows/Fonts/Uni Sans Heavy.otf', { family: 'Uni Sans' })
        const canvas = Canvas.createCanvas(1920, 1080)
        const ctx = canvas.getContext('2d')
        // Canvas.registerFont('../../../AppData/Local/Microsoft/Windows/Fonts/Uni Sans Heavy.otf', { family: 'uni sans heavy' })

        // console.log(Canvas.fc-list)
        const background = await Canvas.loadImage(
            path.join(__dirname, './images/bg2.jpg')
        )
        let x = 0
        let y = 0
        const { width } = canvas
        const { height } = canvas
        roundCorner(ctx, 10, 10, width - 10, height - 10, 40);
        ctx.drawImage(background, x, y)

        x = canvas.width / 2 - (200) / 2
        y = 8


        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', size: 1024 }));

        ctx.fillStyle = '#ffffff'
        ctx.font = '100px Montserrat'
        let text = `WELCOME ${member.user.tag}`
        let xAxis = (width - ctx.measureText(text).width) / 2
        // console.log(xAxis)
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;
        // ctx.fillText(text, xAxis, 800)
        // wrapText(ctx, text, xAxis, 800, width - 75, 50)
        fitText(ctx, text, 'Montserrat', width - 100, xAxis, 800)

        ctx.font = '100px Montserrat'
        text = `Member #${guild.memberCount}`
        let xAxis2 = width / 2 - ctx.measureText(text).width / 2
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;
        ctx.fillText(text, xAxis2, 930)

        // roundRect(ctx, 20, 20, width - 30, height - 30, 20);

        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;

        ctx.beginPath()
        ctx.arc(width / 2, height / 3, 300, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.fill()

        // console.log(height, width)

        ctx.beginPath();
        ctx.arc(width / 2, height / 3, 293, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, (width / 2) - (600 / 2), 65, 600, 600);

        const attachment = new MessageAttachment(canvas.toBuffer())
        channel.send(welcomeMessage, attachment)
    })
}

function fitText(context, text, fontface, maxWidth, xPosition, yPosition) {

    // start with a large font size
    let fontsize = 101;
    xPosition = xPosition < 50 ? 50 : xPosition

    // lower the font size until the text fits the canvas
    do {
        fontsize--;
        context.font = fontsize + "px " + fontface;
    } while (context.measureText(text).width > maxWidth)

    // draw the text
    context.fillText(text, xPosition, yPosition);

    // console.log("A fontsize of " + fontsize + "px fits this text on the canvas");

}

function roundRect(context, x, y, w, h, radius) {
    var r = x + w;
    var b = y + h;
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = "20";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.moveTo(x + radius, y);
    context.lineTo(r - radius, y);
    context.quadraticCurveTo(r, y, r, y + radius);
    context.lineTo(r, y + h - radius);
    context.quadraticCurveTo(r, b, r - radius, b);
    context.lineTo(x + radius, b);
    context.quadraticCurveTo(x, b, x, b - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.stroke();
    context.closePath();
}

function roundCorner(context, x, y, w, h, radius) {
    var r = x + w;
    var b = y + h;
    context.beginPath();
    context.strokeStyle = "green";
    context.lineWidth = "20";
    context.moveTo(x + radius, y);
    context.lineTo(r - radius, y);
    context.quadraticCurveTo(r, y, r, y + radius);
    context.lineTo(r, y + h - radius);
    context.quadraticCurveTo(r, b, r - radius, b);
    context.lineTo(x + radius, b);
    context.quadraticCurveTo(x, b, x, b - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    context.clip();
}