module.exports = {
    commands: ['say', 'speak'],
    description: 'Repeats the sentence after you',
    aliases: ['speak'],
    usage: '<message>',
    minArgs: 1,

    execute (message, args) {
        // console.log(message.mentions.users.first(), message.mentions.roles.first(), message.mentions.everyone)
        if(message.mentions.users.first() || message.mentions.roles.first() || message.mentions.everyone)
        return message.channel.send('You cannot mention users/roles.')
        
        const sayMessage = args.join(' ');
        message.delete().catch(err => console.log(err));
        message.channel.send(sayMessage)
    }
}