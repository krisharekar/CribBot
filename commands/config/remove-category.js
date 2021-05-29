const Discord = require('discord.js')
const categorySchema = require('../../schemas/category-schema')

module.exports = {
    commands: ['remove-category', 'removecategory'],
    description: 'Removes a donation category',
    usage: '<category-name>',
    minArgs: 1,
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client, prefix) {
        const guildId = message.guild.id
        const categoryId = args[0].toLowerCase()

        const result = await categorySchema.findOne({ guildId }, { category: { $elemMatch: { categoryId } } })
        console.log(result)
        if (!result || !result.category[0])
            return message.channel.send(`Category \`${categoryId}\` doesn\'t exist.`)

        const filter = m => m.author.id == message.author.id
        const awaitMessages = async () => {
            const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 })
            const msg = collected.first()

            return msg
        }

        await message.channel.send(`Are you sure you want to delete category \`${result.category[0].categoryName}\`? \`[y/n]\``)

        const msg1 = await awaitMessages()
        if (!msg1)
            return message.channel.send('You did not respond in time.')

        const answer = msg1.content.toLowerCase()

        if (answer != 'y' && answer != 'n')
            return message.channel.send('That\'s not a valid choice.')

        if (answer === 'y') {
            await categorySchema.findOneAndUpdate({ guildId }, { $pull: { category: result.category[0] } })
        }
        else
            return message.channel.send('Cancelled.')

        message.channel.send(`Category \`${result.category[0].categoryName}\` has been deleted.`)
    }
}