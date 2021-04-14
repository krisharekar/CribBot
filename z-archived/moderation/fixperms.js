module.exports = {
    commands: ['fixperms'],

    async execute(message, args) {
        if(message.author.id != '714808648517550144')
        return message.channel.send('Nice try but, only Krish can use this command. Sorry not sorry.')

        const role = message.guild.roles.cache.get('800687205751455754')

        if(!role)
        return message.channel.send('Couldn\'t find the role.')

        message.guild.channels.cache.forEach(c => {
            
                c.updateOverwrite(role.id, {
                    VIEW_CHANNEL: null
                })
            
        })
        message.channel.send('FIXED THE FUCKING PERMS. AARAV DONT TOUCH PERMS AGAIN!')
    }
}