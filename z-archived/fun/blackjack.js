const Discord = require('discord.js');

module.exports = {
    commands: ['blackjack', 'bj'],
    descriptions: 'A game of blackjack',
    aliases: ['bj'],
    usage: '',

    async execute(message, args, client) {

        const userId = message.author.id
        const guildId = message.guild.id
        const member = message.author.username

        const bot = client.user.username

        const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]
        const colors = ["♠", "♥", "♣", "♦"]

        let c1 = []
        let bc1 = []

        let total = botTotal = 0

        let userCount = botCount = 0

        let userHand, botHand

        let timeError

        let gameEnded

        let gameEmbed

        bc1[0] = cards[Math.floor(Math.random() * cards.length)]
        bc1[1] = '?'

        await message.channel.send('What do you want to do?\nType `h` to hit, type `s` to stand, or type `e` to end the game.')

        for (j = 0; j <= 1; j++) {

            userHand = drawCard(c1, total, j, userCount)
            c1 = userHand.cardSet
            total = userHand.total
            userCount = userHand.aceCount
        }

        botHand = drawCard(bc1, botTotal, 0, botCount)
        bc1 = botHand.cardSet
        botTotal = botHand.total
        botCount = botHand.aceCount

        gameEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}'s Blackjack Game`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('BLUE')
            .addFields(
                { name: `${member}`, value: `Cards - ${c1.map(c => `[\`${c}\`](https://youtu.be/dQw4w9WgXcQ)`).join(' ')} \n Total - \`${total}\``, inline: true },
                { name: `${bot}`, value: `Cards - ${bc1.map(c => `[\`${c}\`](https://youtu.be/dQw4w9WgXcQ)`).join(' ')} \n Total - \` ? \``, inline: true }
            )
            .setFooter('K, Q, J = 10  |  A = 1 or 11')

        for (i = 2; i <= 5; i++) {
            if (gameEnded) { break; }
            let filter = m => m.author.id === message.author.id
            await message.channel.send(gameEmbed)
            await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(async (collected) => {
                    const msg = collected.first()

                    //STAND

                    if (msg.content.toUpperCase() == 'S' || msg.content.toUpperCase() == 'STAND') {

                        for (k = 1; k <= 5; k++) {

                            botHand = drawCard(bc1, botTotal, k, botCount)
                            bc1 = botHand.cardSet
                            botTotal = botHand.total
                            botCount = botHand.aceCount

                            values = { member, bot, c1, bc1, total, botTotal }

                            if (botTotal > 17) {
                                if (botTotal > 21) {

                                    if (botCount > 0) {
                                        botTotal = botTotal - 10
                                        botCount--
                                    }

                                    if (botTotal > 21) {
                                        gameEmbed = updateEmbed('winningText', 'GREEN', values, message)
                                        gameEnded = true
                                        return message.channel.send(gameEmbed)
                                    }
                                }

                                if (total === botTotal) {
                                    gameEmbed = updateEmbed('tieText', 'YELLOW', values, message)
                                    gameEnded = true
                                    return message.channel.send(gameEmbed);
                                }

                                if (total > botTotal) {

                                    gameEmbed = updateEmbed('winningText', 'GREEN', values, message)
                                    gameEnded = true
                                    return message.channel.send(gameEmbed);
                                }

                                else {
                                    gameEmbed = updateEmbed('losingText', 'RED', values, message)
                                    gameEnded = true
                                    return message.channel.send(gameEmbed);
                                }
                            }
                        }
                    }

                    //HIT

                    else if (msg.content.toUpperCase() == 'H' || msg.content.toUpperCase() == 'HIT') {

                        userHand = drawCard(c1, total, i, userCount)
                        c1 = userHand.cardSet
                        total = userHand.total
                        userCount = userHand.aceCount

                        values = { member, bot, c1, bc1, total, botTotal }

                        if (total > 21) {

                            if (userCount > 0) {
                                total = total - 10
                                userCount--
                            }

                            if (total > 21) {
                                gameEmbed = updateEmbed('bustedText', 'RED', values, message)

                                gameEnded = true
                                return message.channel.send(gameEmbed)
                            }
                        }


                        if (total === 21) {
                            gameEmbed = updateEmbed('winningText', 'GREEN', values, message)

                            gameEnded = true
                            return message.channel.send(gameEmbed);
                        }


                        if (botTotal === 21) {
                            gameEmbed = updateEmbed('losingText', 'RED', values, message)

                            gameEnded = true
                            return message.channel.send(gameEmbed);
                        }

                        if (total <= 21 && c1.length === 5) {
                            gameEmbed = updateEmbed('winningText', 'GREEN', values, message)

                            gameEnded = true
                        }

                        else {
                            gameEmbed = new Discord.MessageEmbed()
                                .setAuthor(`${message.author.username}'s Blackjack Game`, message.author.displayAvatarURL({ dynamic: true }))
                                .setColor('BLUE')
                                .addFields(
                                    { name: `${member}`, value: `Cards - ${c1.map(c => `[\`${c}\`](https://youtu.be/dQw4w9WgXcQ)`).join(' ')} \n Total - \`${total}\``, inline: true },
                                    { name: `${bot}`, value: `Cards - ${bc1.map(c => `[\`${c}\`](https://youtu.be/dQw4w9WgXcQ)`).join(' ')} \n Total - \` ? \``, inline: true }
                                )
                                .setFooter('K, Q, J = 10  |  A = 1 or 11')
                        }
                    }

                    //END

                    else if (msg.content.toUpperCase() == 'E' || msg.content.toUpperCase() == 'END') {
                        gameEnded = true
                        return message.channel.send('You ended the game. What a wimp.')
                    }

                    //INVALID RESPONSE

                    else {
                        gameEnded = true
                        return message.channel.send('Thats not a valid response.')
                    }
                })
                .catch(err => {
                    console.log(err)
                    timeError = true
                })
            if (timeError && !gameEnded)
                return message.channel.send("You have to respond to me bruh.")
        }
    }
}

function drawCard(cardSet, total, count, aceCount) {
    const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]
    const colors = ["♠", "♥", "♣", "♦"]
    cardSet[count] = `${colors[Math.floor(Math.random() * colors.length)]} ${cards[Math.floor(Math.random() * cards.length)]}`
    let newCard

    if (cardSet[count].slice(2) === "A") {
        if (total + 11 <= 21) {
            newCard = 11
            aceCount++
        }

        else
            newCard = 1
    }
    else if (cardSet[count].slice(2) === "J" || cardSet[count].slice(2) === "Q" || cardSet[count].slice(2) === "K")
        newCard = 10

    else if (cardSet[count].slice(2) >= 1 && cardSet[count].slice(2) <= 10)
        newCard = parseInt(cardSet[count].slice(2))

    total = total + newCard
    return { cardSet, total, aceCount }
}

function updateEmbed(text, color, values, message) {
    let { member, bot, c1, bc1, total, botTotal } = values

    if(text == 'winningText') text = `**You win! The dealer busted. You have ${total}, Dealer has ${botTotal}.**`
    if(text == 'tieText') text = `**Its a tie. You have ${total}, Dealer has ${botTotal}.**`
    if(text == 'losingText') text = `**You lost! You have ${total}, Dealer has ${botTotal}.**`
    if(text == 'bustedText') text = `**You busted! You have ${total}, Dealer has ${botTotal}.**`

    const gameEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}'s Blackjack Game`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(text)
        .setColor(color)
        .addFields(
            { name: `${member}`, value: `Cards - ${c1.map(c => `[\`${c}\`](https://youtu.be/dQw4w9WgXcQ)`).join(' ')} \n Total - \`${total}\``, inline: true },
            { name: `${bot}`, value: `Cards - ${bc1.map(c => `[\`${c}\`](https://youtu.be/dQw4w9WgXcQ)`).join(' ')} \n Total - \`${botTotal}\``, inline: true }
        )
        .setFooter('K, Q, J = 10  |  A = 1 or 11')

    return gameEmbed
}