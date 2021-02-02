const Discord = require('discord.js')

const { promptMessage } = require('discord.js');

const chooseArr = ["🗿", "📄", "✂"]

module.exports = {
    commands: ['rps', 'rockpaperscissors'],
    description: 'A good game of rock paper scissors',
    aliases: ['rockpaperscissors'],
    usage: '',

    async execute(message, args) {

        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)]

        const filter = (reaction, user) => {
            return ['🗿', '📄', '✂'].includes(reaction.emoji.name) && user.id === message.author.id;
        };


        var gameEmbed = new Discord.MessageEmbed()
            .setTitle('Choose rock, paper or scissors.')
            .setColor('BLUE')
            .setFooter(message.author.username)
            .setDescription('**React with:**\n🗿 for **Rock**\n📄 for **Paper**\n✂ for **Scissors**')
            .setTimestamp()

        const msg = await message.channel.send(gameEmbed)

        msg.react("🗿");
        msg.react("📄");
        msg.react("✂");

        await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .catch(err => {
                return message.channel.send('You have to respond to me bruh.')
            })
            .then(async collected => {
                let userChoice = collected.first().emoji.name
                msg.reactions.removeAll()

                if ((userChoice === "🗿" && botChoice === "✂") ||
                    (userChoice === "📄" && botChoice === "🗿") ||
                    (userChoice === "✂" && botChoice === "📄")) {
                    let result = "You won.";

                    gameEmbed
                        .setTitle(result)
                        .setColor('GREEN')
                        .setDescription(`${userChoice} vs ${botChoice}`)
                        .setFooter(message.author.username)
                        .setTimestamp()
                    msg.edit(gameEmbed);
                }
                else if (userChoice == botChoice) {
                    let result = "Uhh, its a tie."

                    gameEmbed
                        .setTitle(result)
                        .setColor('YELLOW')
                        .setDescription(`${userChoice} vs ${botChoice}`)
                        .setFooter(message.author.username)
                        .setTimestamp()
                    msg.edit(gameEmbed);
                }
                else {
                    let result = "I won, hahaha."

                    gameEmbed
                        .setTitle(result)
                        .setColor('RED')
                        .setDescription(`${userChoice} vs ${botChoice}`)
                        .setFooter(message.author.username)
                        .setTimestamp()
                    msg.edit(gameEmbed);
                }

            })

    }
}