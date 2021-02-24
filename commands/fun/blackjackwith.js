const Discord = require('discord.js');

module.exports = {
    commands: ['blackjackwith', 'bjw', 'bjwith', 'blackjackw'],
    descriptions: 'A game of blackjack with an opponent',
    aliases: ['bjw', 'bjwith', 'blackjackw'],
    usage: '<user>',


    async execute(message, args, client) {

        const memberId = message.author.id

        const member = message.author.username

        const opponentID = message.mentions.users.first()

        if (!opponentID)
            return message.reply("Mention a user to play with.")

        const opponent = message.mentions.users.first().username

        const bot = client.user.username

        const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]

        const color = ["♠", "♥", "♣", "♦"]

        var c1 = []

        var c2 = []

        var bc1 = []

        var card

        var card2

        var card3

        var total = 0

        var botTotal = 0

        var opponentTotal = 0

        var userCount = 0

        var botCount = 0

        var opponentCount = 0

        var gameEmbed = new Discord.MessageEmbed()

        bc1[0] = cards[Math.floor(Math.random() * cards.length)]

        for (j = 0; j <= 1; j++) {

            c1[j] = cards[Math.floor(Math.random() * cards.length)]

            if (c1[j] === "A") {
                if (total + 11 < 21) {
                    card = 11
                    userCount++
                }

                else
                    card = 1
            }
            else if (c1[j] === "J" || c1[j] === "Q" || c1[j] === "K")
                card = 10

            else if (c1[j] >= 2 && c1[j] <= 10)
                card = c1[j]

            total = total + card

            // Opponents hand

            c2[j] = cards[Math.floor(Math.random() * cards.length)]

            if (c2[j] === "A") {
                if (opponentTotal + 11 < 21) {
                    card3 = 11
                    opponentCount++
                }

                else
                    card3 = 1
            }
            else if (c2[j] === "J" || c2[j] === "Q" || c2[j] === "K")
                card3 = 10

            else if (c2[j] >= 2 && c2[j] <= 10)
                card3 = c2[j]

            opponentTotal = opponentTotal + card3
        }




        if (bc1[0] === "A") {
            if (total + 11 < 21) {
                card2 = 11
                botCount++
            }

            else
                card2 = 1
        }
        else if (bc1[0] === "J" || bc1[0] === "Q" || bc1[0] === "K")
            card2 = 10

        else if (bc1[0] >= 1 && bc1[0] <= 10)
            card2 = bc1[0]


        botTotal = botTotal + card2

        gameEmbed = new Discord.MessageEmbed()
            .setTitle(`${member}'s Blackjack Game`)
            .setColor('BLUE')
            .addFields(
                { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                { name: `${bot}`, value: `Cards - ${bc1}, ? \n Total - ?`, inline: true }
            )
            .setFooter('K, Q, J = 10  |  A = 1 or 11')

        await message.channel.send(`<@${memberId}> `+'what do you want to do?\nType `h` to hit, type `s` to stand, or type `e` to end the game.')

        for (i = 2; i <= 5; i++) {

            let filter = m => m.author.id === message.author.id
            await message.channel.send(gameEmbed)
            const messages = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .catch(err => {
                    message.channel.send("You have to respond to me bruh.")
                })

            const msg = messages.first()

            if (msg.content.toUpperCase() === 'S')
                break;


            else if (msg.content.toUpperCase() === 'E') {
                return message.channel.send('You ended the game. What a wimp.')
            }

            else if (msg.content.toUpperCase() === 'H') {

                c1[i] = cards[Math.floor(Math.random() * cards.length)]

                if (c1[i] === "A") {
                    if (total + 11 < 21) {
                        card = 11
                        userCount++
                    }
                    else
                        card = 1
                }
                else if (c1[i] === "J" || c1[i] === "Q" || c1[i] === "K")
                    card = 10

                else if (c1[i] >= 2 && c1[i] <= 10)
                    card = c1[i]


                total = total + card


                if (total > 21) {

                    if (userCount > 0) {
                        total = total - 10
                        userCount--
                    }

                    if (total > 21) {
                        gameEmbed = new Discord.MessageEmbed()
                            .setTitle(`${member}'s Blackjack Game`)
                            .setDescription(`**${member} you busted! ${member} you have ${total}, ${opponent} you have ${opponentTotal}, Dealer has ${botTotal}.**`)
                            .setColor('RED')
                            .addFields(
                                { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                            )
                            .setFooter('K, Q, J = 10  |  A = 1 or 11')

                        message.channel.send(gameEmbed);
                        break;
                    }
                }


                if (total === 21) {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setDescription(`**${member} you win! ${member} you have ${total}, ${opponent} you have ${opponentTotal}, Dealer has ${botTotal}.**`)
                        .setColor('GREEN')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')

                    message.channel.send(gameEmbed);
                    break;
                }


                if (botTotal === 21) {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setDescription(`**${member} you lose! ${member} you have ${total}, ${opponent} you have ${opponentTotal}, Dealer has ${botTotal}.**`)
                        .setColor('RED')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')

                    message.channel.send(gameEmbed);
                    break;
                }

                if (total < 21 && c1.length === 5) {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setDescription(`**${member} you win! You drew 5 cards.**`)
                        .setColor('GREEN')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')

                    message.channel.send(gameEmbed)
                    break;
                }

                else {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setColor('BLUE')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1}, ? \n Total - ?`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')
                }
            }
            else
                return message.channel.send("That's not a valid response.")
        }


        gameEmbed = new Discord.MessageEmbed()
            .setTitle(`${member}'s Blackjack Game`)
            .setColor('BLUE')
            .addFields(
                { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                { name: `${bot}`, value: `Cards - ${bc1}, ? \n Total - ?`, inline: true }
            )
            .setFooter('K, Q, J = 10  |  A = 1 or 11')


        // Opponents turn

        await message.channel.send(`<@${opponentID.id}> `+'what do you want to do?\nType `h` to hit, type `s` to stand, or type `e` to end the game.')

        for (i = 2; i <= 5; i++) {

            let filter = m => m.author.id === opponentID.id
            await message.channel.send(gameEmbed)
            const messages = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .catch(err => {
                    message.channel.send("You have to respond to me bruh.")
                })

            const msg = messages.first()

            if (msg.content.toUpperCase() === 'S') {

                for (k = 1; k <= 5; k++) {

                    bc1[k] = cards[Math.floor(Math.random() * cards.length)]

                    if (bc1[k] === "A") {
                        if (total + 11 < 21) {
                            card2 = 11
                            botCount++
                        }

                        else
                            card2 = 1
                    }
                    else if (bc1[k] === "J" || bc1[k] === "Q" || bc1[k] === "K")
                        card2 = 10

                    else if (bc1[k] >= 1 && bc1[k] <= 10)
                        card2 = bc1[k]

                    botTotal = botTotal + card2

                    if (botTotal > 17) {
                        if (botTotal > 21) {

                            if (botCount > 0) {
                                botTotal = botTotal - 10
                                botCount--
                            }

                            if (botTotal > 21)
                                gameEmbed = new Discord.MessageEmbed()
                                    .setTitle(`${member}'s Blackjack Game`)
                                    .setDescription(`**${opponent} you win! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                                    .setColor('GREEN')
                                    .addFields(
                                        { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                        { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                        { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                                    )
                                    .setFooter('K, Q, J = 10  |  A = 1 or 11')

                            return message.channel.send(gameEmbed);
                        }

                        if (total === botTotal) {
                            gameEmbed = new Discord.MessageEmbed()
                                .setTitle(`${member}'s Blackjack Game`)
                                .setDescription(`**${opponent} It's a tie! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                                .setColor('YELLOW')
                                .addFields(
                                    { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                    { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                    { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                                )
                                .setFooter('K, Q, J = 10  |  A = 1 or 11')

                            return message.channel.send(gameEmbed);
                        }

                        if (botTotal === 21) {
                            gameEmbed = new Discord.MessageEmbed()
                                .setTitle(`${member}'s Blackjack Game`)
                                .setDescription(`**${member} you lose! ${member} you have ${total}, ${opponent} you have ${opponentTotal}, Dealer has ${botTotal}.**`)
                                .setColor('RED')
                                .addFields(
                                    { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                    { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                    { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                                )
                                .setFooter('K, Q, J = 10  |  A = 1 or 11')

                            return message.channel.send(gameEmbed);

                        }

                        if (total > botTotal) {

                            gameEmbed = new Discord.MessageEmbed()
                                .setTitle(`${member}'s Blackjack Game`)
                                .setDescription(`**${opponent} you win! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                                .setColor('GREEN')
                                .addFields(
                                    { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                    { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                    { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                                )
                                .setFooter('K, Q, J = 10  |  A = 1 or 11')

                            return message.channel.send(gameEmbed);
                        }

                        else {
                            gameEmbed = new Discord.MessageEmbed()
                                .setTitle(`${member}'s Blackjack Game`)
                                .setDescription(`**${opponent} you lose! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                                .setColor('RED')
                                .addFields(
                                    { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                    { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                    { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                                )
                                .setFooter('K, Q, J = 10  |  A = 1 or 11')

                            return message.channel.send(gameEmbed);
                        }
                    }
                }
            }

            else if (msg.content.toUpperCase() === 'E') {
                return message.channel.send('You ended the game. What a wimp.')
            }

            else if (msg.content.toUpperCase() === 'H') {

                c2[i] = cards[Math.floor(Math.random() * cards.length)]

                if (c2[i] === "A") {
                    if (opponentTotal + 11 < 21) {
                        card3 = 11
                        opponentCount++
                    }
                    else
                        card3 = 1
                }
                else if (c2[i] === "J" || c2[i] === "Q" || c2[i] === "K")
                    card3 = 10

                else if (c2[i] >= 2 && c2[i] <= 10)
                    card3 = c2[i]


                opponentTotal = opponentTotal + card3


                if (opponentTotal > 21) {

                    if (opponentCount > 0) {
                        opponentTotal = opponentTotal - 10
                        opponentCount--
                    }

                    if (opponentTotal > 21) {
                        gameEmbed = new Discord.MessageEmbed()
                            .setTitle(`${member}'s Blackjack Game`)
                            .setDescription(`**${opponent} you busted! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                            .setColor('RED')
                            .addFields(
                                { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                                { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                                { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                            )
                            .setFooter('K, Q, J = 10  |  A = 1 or 11')

                        return message.channel.send(gameEmbed);
                    }
                }


                if (opponentTotal === 21) {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setDescription(`**${opponent} you win! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                        .setColor('GREEN')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')

                    return message.channel.send(gameEmbed);
                }


                if (botTotal === 21) {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setDescription(`**${opponent} you lose! ${opponent} you have ${opponentTotal}, ${member} you have ${total}, Dealer has ${botTotal}.**`)
                        .setColor('RED')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')

                    return message.channel.send(gameEmbed);
                }

                if (opponentTotal < 21 && c2.length === 5) {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setDescription(`**${opponent} you win! You drew 5 cards.**`)
                        .setColor('GREEN')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1} \n Total - ${botTotal}`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')

                    return message.channel.send(gameEmbed)
                }

                else {
                    gameEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member}'s Blackjack Game`)
                        .setColor('BLUE')
                        .addFields(
                            { name: `${member}`, value: `Cards - ${c1} \n Total - ${total}`, inline: true },
                            { name: `${opponent}`, value: `Cards - ${c2} \n Total - ${opponentTotal}`, inline: true },
                            { name: `${bot}`, value: `Cards - ${bc1}, ? \n Total - ?`, inline: true }
                        )
                        .setFooter('K, Q, J = 10  |  A = 1 or 11')
                }
            }
            else
                return message.channel.send("That's not a vaild response.")
        }
    }
}