module.exports = {
    commands: ['fixperms'],

    async execute(message, args) {
        if(message.author.id != '714808648517550144')
        return message.channel.send('Nice try but, only Krish can use this command. Sorry not sorry.')

        const role = message.guild.roles.cache.get('800687205751455754')
        const role2 = message.guild.roles.cache.get('811909460075085854')

        if(!role || !role2)
        return message.channel.send('Couldn\'t find the role.')

        message.guild.channels.cache.forEach(c => {
            if(c.type != 'category') {
                c.updateOverwrite(role.id, {
                    SEND_MESSAGES: null
                })
                c.updateOverwrite(role2.id, {
                    SEND_MESSAGES: false
                })
            }
        })
        message.channel.send('FIXED THE FUCKING PERMS. AARAV DONT TOUCH PERMS AGAIN!')
    }
}