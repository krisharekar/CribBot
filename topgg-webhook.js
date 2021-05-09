const Discord = require('discord.js')
const AutoPoster = require('topgg-autoposter')
const Topgg = require('@top-gg/sdk')
const express = require('express')
const { topggToken } = require('./config.json')
const webhookURL = 'SLxBSiWBub3SXx7sPZokgOm9mr1wxT7bT3NF3v8h4nPfb6wAXlsVLc0nltUktLoAQCHY'
const webhookURL2 = 'https://discord.com/api/webhooks/840900091606597674/SLxBSiWBub3SXx7sPZokgOm9mr1wxT7bT3NF3v8h4nPfb6wAXlsVLc0nltUktLoAQCHY'
const DBL = require('dbl-api')
module.exports = (client) => {
    const ap = AutoPoster(topggToken, client)
    ap.on('posted', () => {
        const channel = client.channels.cache.get('840895477821997066')
        if (channel)
            channel.send('Posted stats to Top.gg!')
    }) //every 30mins

    // const app = express()

    // const webhook = new Topgg.Webhook(webhookURL)

    // app.post("/dblwebhook", webhook.listener((vote) => {
    //     console.log(vote.user)
    //     const user = client.users.cache.get(vote.user)
    //     const embed = new Discord.MessageEmbed()
    //         .setAuthor(`${user ? user.tag : vote.user} just voted the bot!`, user ? user.displayAvatarURL() : '')
    //         .setDescription(`Thank you for voting ${client.user.username} on Top.gg\nYou can vote the bot [here](http://top.gg/bot/744210245403934780/vote) every 12 hours!`)

    //     const channel = client.channels.cache.get('840892150879092756')
    //     if (channel)
    //         channel.send(embed)
    // }))
    // const webhook = new Topgg.Webhook(webhookURL2)

    // app.post('/webhook', webhook.listener((vote) => {
    //     console.log(vote.user)
    //     const user = client.users.cache.get(vote.user)
    //     const embed = new Discord.MessageEmbed()
    //         .setAuthor(`${user ? user.tag : vote.user} just voted the bot!`, user ? user.displayAvatarURL() : '')
    //         .setDescription(`Thank you for voting ${client.user.username} on Top.gg\nYou can vote the bot [here](http://top.gg/bot/744210245403934780/vote) every 12 hours!`)

    //     const channel = client.channels.cache.get('840892150879092756')
    //     if (channel)
    //         channel.send(embed)
    // }))

    // app.listen(80)
}