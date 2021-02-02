const Discord = require('discord.js')

module.exports = async (client) => {

    client.on('ready', async () => {

        setInterval(async () => {

            let activitiesList = ['WATCHING', 'LISTENING', 'PLAYING']

            let randomActivityList = activitiesList[Math.floor(Math.random() * activitiesList.length)]

            var activities

            if (randomActivityList === 'WATCHING') {

                activities = [
                    'Krish not study.',
                    'You.',
                    'muffins.',
                    'my code.',
                    'Mrbeast\'s Videos'
                ];
            }

            if (randomActivityList === 'LISTENING') {

                activities = [
                    'Krish.',
                    'Spotify.'
                ];
            }

            if (randomActivityList === 'PLAYING') {

                activities = [
                    'with my errors.',
                    'with Krish.'
                ];
            }

            let randomActivity = activities[Math.floor(Math.random() * activities.length)]

            await client.user.setActivity(randomActivity, { type: `${randomActivityList}` });

        }, 10 * 60 * 1000);
    })

    client.on('ready', async () => {
        const names = ['You', 'Mango']
        const random = names[Math.floor(Math.random() * names.length)]
        setInterval(() => {
          client.user.setPresence({
            name: `${random}`,
            type: 'WATCHING'
          })
    }, 5 * 1000) //every 5 seconds
    })
        
}
