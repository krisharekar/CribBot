//R7KVG-9XQX9-37CPT-D3VWQ-7CV7Z

const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } })
const path = require('path')
const fs = require('fs')
const cooldowns = new Discord.Collection()

const levels = require('./levels')
const status = require('./status')
const counting = require('./counting')
const welcome = require('./welcome')
const autoRole = require('./auto-role')
const loadCaches = require('./cache/load-caches')
const chatbot = require('./chatbot')
const mongo = require('./mongo')
const coinDonations = require('./coin-donations')
const itemDonations = require('./item-donations')
const loadCommands = require('./commands/load-commands')
const updateDonorChannel = require('./update-donor-channel')

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
	// await status(client)
	await welcome(client)
	await autoRole(client)
	await loadCommands(client)
	await counting(client)
	await coinDonations(client)
	await itemDonations(client)
	await updateDonorChannel(client)
	await loadCaches()
	console.log('ok')
})

client.on('ready', async () => {
	await client.user.setActivity('Krish', { type: 'LISTENING' })
})

// client.on('guildMemberAdd', member => {
// 	if (member.user.id == '807318024976728085') {
// 		member.kick()
// 		console.log('Nalaude spotted.')
// 		return
// 	}
// })

client.on('message', async message => {
	if (message.channel.id == '805791291312308266' && message.author.id != client.user.id)
		return message.channel.send('nO')
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
