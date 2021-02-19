//R7KVG-9XQX9-37CPT-D3VWQ-7CV7Z

const Discord = require('discord.js');

const config = require('./config.json')

const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } })

const path = require('path')

const fs = require('fs')

const cooldowns = new Discord.Collection()

const levels = require('./levels')

const status = require('./status')
const counting = require('./counting')

const ttt = require('discord-tictactoe');
const { EventEmitter } = require('events')

const welcome = require('./welcome')

const chatbot = require('./chatbot')

const { GiveawaysManager } = require('discord-giveaways');
const mongo = require('./mongo');
const loadCommands = require('./commands/load-commands');

require('events').EventEmitter.defaultMaxListeners = 100

const manager = new GiveawaysManager(client, {
    storage:  './commands/giveaways/giveaways.json',
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        embedColor: "BLUE",
        reaction: '🎉'
    }
})

client.giveawaysManager = manager

new ttt({
    language: 'en',
    command: '>ttt'
}, client)

client.commands = new Discord.Collection();

client.on('ready', async () => {
	await status(client)
	await loadCommands(client)
	await counting(client)
	await mongo()
})

client.on('guildMemberAdd', member => {
	if(member.user.id == '517327116879265824') {
		member.kick()
		console.log('Nalaude spotted.')
		return;
	}
})

client.on('message', async message => {
	if(message.channel.id == '805791291312308266' && message.author.id != client.user.id)
	return message.channel.send('nO')
})

client.once('ready', async () => {
	console.log('Bot is online');

	const baseFile = 'command-base.js'
	const commandBase = require(`./commands/${baseFile}`)

	const readCommands = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for(const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if(stat.isDirectory()) {
				readCommands(path.join(dir, file))
			} else if(file !== baseFile && file !== 'load-commands.js') {
				const option = require(path.join(__dirname, dir, file))
				commandBase(client, option)
			}
		}
	}

	readCommands('commands')
})

client.login(config.token);
