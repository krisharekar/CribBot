const Discord = require('discord.js')

module.exports = async (client) => {

    // client.on('ready', async () => {

    //     setInterval(async () => {

    //         let activitiesList = ['WATCHING', 'LISTENING', 'PLAYING']

    //         let randomActivityList = activitiesList[Math.floor(Math.random() * activitiesList.length)]

    //         var activities

    //         if (randomActivityList === 'WATCHING') {

    //             activities = [
    //                 'Krish not study.',
    //                 'You.',
    //                 'muffins.',
    //                 'my code.',
    //                 'Mrbeast\'s Videos'
    //             ];
    //         }

    //         if (randomActivityList === 'LISTENING') {

    //             activities = [
    //                 'Krish.',
    //                 'Spotify.'
    //             ];
    //         }

    //         if (randomActivityList === 'PLAYING') {

    //             activities = [
    //                 'with my errors.',
    //                 'with Krish.'
    //             ];
    //         }

    //         let randomActivity = activities[Math.floor(Math.random() * activities.length)]

    //         await client.user.setActivity(randomActivity, { type: `${randomActivityList}` });

    //     }, 10 * 60 * 1000);
    // })
    
    await client.user.setActivity('Krish', { type: 'LISTENING' })
}
