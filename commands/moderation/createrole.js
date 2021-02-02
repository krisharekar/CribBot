module.exports = {
    commands: ['createrole', 'newrole'],
    description: 'Creates a new role (under development)',
    aliases: ['crole', 'newrole'],
    usage: '',  

    async execute(message, args) {

        const { guild } = message

        if (message.member.hasPermission('MANAGE_ROLES' || 'ADMINISTRATOR')) {

            var filter = m => m.author.id === message.author.id
            await message.channel.send("What name you want to give the role. You have 30 seconds to respond.")
            var messages = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .catch(err => {
                    message.channel.send("You have to respond to me bruh.")
                })

            const roleName = messages.first()

            var filter = m => m.author.id === message.author.id
            await message.channel.send("What colour you want to give the role. You have 30 seconds to respond.")
            var messages = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .catch(err => {
                    message.channel.send("You have to respond to me bruh.")
                })

            var roleColor = messages.first().content.toUpperCase()

            guild.roles.create({
                data: {
                    name: `${roleName}`,
                    color: `${roleColor}`,
                }
            })
                .catch(err => {
                    return message.channel.send("Something went wrong.")
                })

            message.channel.send(`A new role with the name '${roleName}' has been created.`)
        }

        else {
            message.reply("You do not have permissions to use this command.")
        }
    }
}