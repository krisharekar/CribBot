const Discord = require('discord.js')
const randomPuppy = require('random-puppy')

module.exports = {
    commands: ['meme', 'joke'],
    description: 'Get a good laugh with a great meme',
    aliases: ['joke'],
    usage: '[sub-reddit-page]',
    maxArgs: 1,

    async execute(message, args) {

        const memeName = args.join(" ")

        if (!memeName) {

            const subReddits = [
                'meme',
                'meme_irl',
                'dankmeme',
                'DeepFriedMemes',
                'bonehurtingjuice',
                'surrealmemes',
                'dankmemes',
                'funny',
                'dankmemes'
            ]

            const random = subReddits[Math.floor(Math.random() * subReddits.length)];

            const image = await randomPuppy(random);

            const memeEmbed = new Discord.MessageEmbed()
                .setImage(image)

            return  message.channel.send(memeEmbed);
        }

        else {
            const image = await randomPuppy(memeName)

            const memeEmbed = new Discord.MessageEmbed()
                .setTitle(`From /r/${memeName}`)
                .setImage(image)
                .setURL(`https://reddit.com/${memeName}`)

            message.channel.send(memeEmbed);

        }
    }
}