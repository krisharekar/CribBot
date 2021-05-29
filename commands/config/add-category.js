const Discord = require('discord.js')
const categorySchema = require('../../schemas/category-schema')

module.exports = {
    commands: ['add-category', 'addcategory'],
    description: 'Runs a setup for a new donation category',
    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client, prefix) {
        const guildId = message.guild.id

        const filter = m => m.author.id == message.author.id
        const awaitMessages = async () => {
            const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 })
            const msg = collected.first()

            return msg
        }


        //1st question
        await message.channel.send('What do you want to name the category? (Must be one word only, can contain uppercase as well as lowercase characters).')

        const msg1 = await awaitMessages()
        if (!msg1)
            return message.channel.send('You did not respond in time.')

        const array = msg1.content.split(/ +/g)
        const categoryName = array[0]

        if (array.length > 1)
            return message.channel.send('category name can be only one word.')

        console.log(categoryName)
        const categoryId = array[0].toLowerCase()

        // const result = await categorySchema.findOne({ guildId }, { category: { $elemMatch: { categoryName } } })
        const result = await categorySchema.findOne({ guildId, "category.categoryId": categoryId })
        console.log(result)
        if (result)
            return message.channel.send(`Category with the name \`${categoryName}\` already exists.`)

            
        //2nd question
        await message.channel.send('Are the donations of Dank Memer coins? \`[y/n]\`')
        const msg2 = await awaitMessages()

        if (!msg2)
            return message.channel.send('You did not respond in time.')

        const answer = msg2.content.toLowerCase()

        if (answer != 'y' && answer != 'n')
            return message.channel.send('That\'s not a valid choice.')

        const dankMemerCoins = answer == 'y' ? true : false


        //3rd question
        await message.channel.send('Do you want the donations of this category to be added to the Total Donations of a user? \`[y/n]\`')

        const msg3 = await awaitMessages()

        if (!msg3)
            return message.channel.send('You did not respond in time.')

        const answer2 = msg3.content.toLowerCase()

        if (answer2 != 'y' && answer2 != 'n')
            return message.channel.send('That\'s not a valid choice.')

        const addTotal = answer2 == 'y' ? true : false

        const categoryObject = {
            categoryName,
            categoryId,
            dankMemerCoins,
            addTotal
        }

        await categorySchema.findOneAndUpdate({ guildId }, { $push: { category: categoryObject } }, { upsert: true })

        message.channel.send([`Category \`${categoryName}\` has been created.`,
        `Run \`${prefix}add-donations <user> <amount> ${categoryId}\` to add donations to a user for this category.`,
        `Run \`${prefix}remove-category\` to delete a category.`])
    }
}