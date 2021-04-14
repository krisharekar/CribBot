const Discord = require("discord.js")

track = require('novelcovid');

module.exports = {
    commands: ['corona', 'covid', 'covid19'],
    description: 'Corona stats of a country or globally',
    usage: '<country-name>',
    minArgs: 1,

    async execute(message, args) {

        if (args[0] === 'all' || args[0] === 'everywhere' || args[0] === 'global' || args[0] === 'globally' || args[0] === 'earth') {
            let corona = await track.all()

            let embed = new Discord.MessageEmbed()
                .setTitle("Global Cases")
                .setURL('https://disease.sh')
                .setColor("#ff2050")
                .setDescription("Sometimes cases number may differ from small amount.")
                .addField("Total Cases", corona.cases, true)
                .addField("Total Deaths", corona.deaths, true)
                .addField("Total Recovered", corona.recovered, true)
                .addField("Today's Cases", corona.todayCases, true)
                .addField("Today's Deaths", corona.todayDeaths, true)
                .addField("Active Cases", corona.active, true);

            return message.channel.send(embed)



        } else {
            let corona = await track.countries({ country: args.join(' ') })

            if(corona.cases === undefined)
            return message.channel.send(`No country found with the name '${args.join(' ')}'`)

            let embed = new Discord.MessageEmbed()
                .setTitle(`${corona.country}`)
                .setURL('https://disease.sh')
                .setColor("#ff2050")
                .setDescription("Sometimes cases number may differ from small amount.")
                .addField("Total Cases", corona.cases, true)
                .addField("Total Deaths", corona.deaths, true)
                .addField("Total Recovered", corona.recovered, true)
                .addField("Today's Cases", corona.todayCases, true)
                .addField("Today's Deaths", corona.todayDeaths, true)
                .addField("Active Cases", corona.active, true);

            return message.channel.send(embed)


        }



    }
}