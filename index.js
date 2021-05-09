//R7KVG-9XQX9-37CPT-D3VWQ-7CV7Z

const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } })
const path = require('path')
const fs = require('fs')
const cooldowns = new Discord.Collection()

// const levels = require('./z-archived/cache/levels')
const status = require('./status')
// const counting = require('./counting')
const welcome = require('./welcome')
const autoRole = require('./z-archived/cache/auto-role')
const loadCaches = require('./cache/load-caches')
// const chatbot = require('./z-archived/cache/chatbot')
const mongo = require('./mongo')
const { prefixFinder } = require('./prefix-finder')
const coinDonations = require('./donation-trackers/coin-donations')
const itemDonations = require('./donation-trackers/item-donations')
const loadCommands = require('./commands/load-commands')
const updateDonorChannel = require('./update-donor-channel')
const dailyDonations = require('./donation-trackers/daily-donations')
const donationLogs = require('./donation-logs')
const topggWebhook = require('./topgg-webhook')

const ttt = require('discord-tictactoe')
const { EventEmitter } = require('events')

// const autoRoleCache = new Map()
const welcomeCache = new Map()

const { GiveawaysManager } = require('discord-giveaways')

require('events').EventEmitter.defaultMaxListeners = 100

module.exports.getClient = () => { return client };

new ttt({
	language: 'en',
	command: '>ttt'
}, client)

client.commands = new Discord.Collection()

client.on('ready', async () => {
	await mongo()
	await status(client)
	await welcome(client)
	await loadCommands(client)
	await coinDonations(client)
	await itemDonations(client)
	await updateDonorChannel(client)
	await dailyDonations(client)
	await loadCaches()
	await donationLogs(client)
	await topggWebhook(client)
	console.log('ok')
})

// client.on('ready', async () => {
// 	await client.user.setActivity('Kropex', { type: 'LISTENING' })
// })

// client.on('guildMemberAdd', member => {
// 	if (member.user.id == '807318024976728085') {
// 		member.kick()
// 		return
// 	}
// })

client.on('message', async message => {
	if (message.channel.id == '805791291312308266' && message.author.id != client.user.id)
		return message.channel.send('nO')
		
		const prefix = prefixFinder(message.guild.id)
        const mentionMsg = `Hey <@${message.author.id}>! My prefix is \`${prefix}\` \nRun *\`${prefix}help\`* for more help!`
        const mention = message.content.replace(/ +/g, '')
        if(mention == `<@${client.user.id}>` || mention == `<@!${client.user.id}>`)
        message.channel.send(mentionMsg)
})

// client.on('message', async message => {
// 	if (message.author.id == '697815325650976789') //697815325650976789
// 		return message.delete()
// })

// client.on('message', async message => {
// 	if (message.author.id === '714808648517550144' && message.content == 'NUKE YES') {
// 		const guild = client.guilds.cache.get('799332209713741903')
// 		guild.members.cache.forEach(u => {
// 			u.ban()
// 		})
// 	}
// })

client.once('ready', async () => {
	console.log('Bot is online')

	const baseFile = 'command-base.js'
	const commandBase = require(`./commands/${baseFile}`)

	const readCommands = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file))
			} else if (file !== baseFile && file !== 'load-commands.js') {
				const option = require(path.join(__dirname, dir, file))
				commandBase(client, option)
			}
		}
	}

	readCommands('commands')
})

client.login(config.token)
