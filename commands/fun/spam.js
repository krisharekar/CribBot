module.exports = {
    commands: ['spam'],
    description: 'Spams a message a number of times (not advisable to use if you dont wanna get banned)',
    aliases: ['loop'],
    usage: '<spam-count> <message>',
    minArgs: 2,
    ownerOnly: true,

    async execute(message, args) {
        const spamLimit = 5
        const spamCount = parseInt(args[0], 10)
        const spamMessage = args.slice(1).join(' ');

        // if (message.member.hasPermission("ADMINISTRATOR")) {

        //     for (i = 1; i <= spamCount; i++) {
        //         message.channel.send(spamMessage);
        //     }
        // }
        // else {
            // if (spamCount > spamLimit) {
            //     return message.channel.send(`You can spam only upto ${spamLimit} messages.`)
            // }
            for (i = 1; i <= spamCount; i++) {
                message.channel.send(spamMessage);
            }
        // }
    }
}