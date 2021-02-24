// const mongo = require('../../mongo')
// const mongoose = require('mongoose')
// const welcomeSchema = require('../../schemas/welcome-schema')

// module.exports = {
//     commands: ['setwelcome', 'welcomechannel', 'setwelcomechannel'],
//     description: 'Sets the channel and message to be sent when a user joins the server',
//     usage: '<channel> <welcome-message>',
//     minArgs: 2,
//     permissions: ['ADMINISTRATOR'],

//     async execute(message, args) {
//         const { guild } = message
//         const guildId = guild.id
//         const channel = message.mentions.channels.first() || guild.channels.cache.get(args[0])

//         if(!channel)
//         return message.channel.send('Please specify a channel to set as the welcome channel.')

//         const welcomeChannel = channel.id
//         const welcomeMessage = args.slice(1).join(' ')

//         if(!welcomeMessage)
//         return message.channel.send('Specify the welcome message to be sent.')

//                 const result = await welcomeSchema.findOneAndUpdate(
//                     {
//                         guildId
//                     },
//                     {
//                         guildId,
//                         welcomeChannel,
//                         welcomeMessage
//                     },
//                     {
//                         upsert: true
//                     }
//                 )

//                 message.channel.send('Welcome message and welcome channel have been set.')
//        
//     }
// }