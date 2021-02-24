module.exports = {
    commands: ['say', 'speak'],
    description: 'Repeats the sentence after you',
    aliases: ['speak'],
    usage: '<message>',
    minArgs: 1,

    execute (message, args) {
        if(message.mentions)
        return message.channel.send('You cannot mention users/roles.')
        
        const sayMessage = args.join(' ');
        message.delete().catch(err => console.log(err));
        message.channel.send(sayMessage)
    }
}