//R7KVG-9XQX9-37CPT-D3VWQ-7CV7Z

const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } })
const path = require('path')
const fs = require('fs')
const cooldowns = new Discord.Collection()

// const levels = require('./z-archived/cache/levels')
const status = require('./assets/status')
// const counting = require('./counting')
const welcome = require('./assets/welcome')
const loadCaches = require('./cache/load-caches')
// const chatbot = require('./z-archived/cache/chatbot')
const mongo = require('./mongo')
const { prefixFinder } = require('./assets/prefix-finder')
const coinDonations = require('./donation-trackers/coin-donations')
const itemDonations = require('./donation-trackers/item-donations')
const loadCommands = require('./commands/load-commands')
const updateDonorChannel = require('./assets/update-donor-channel')
const dailyDonations = require('./donation-trackers/daily-donations')
const donationLogs = require('./assets/donation-logs')
const guildCreateAndDelete = require('./assets/guild-create-and-delete')
const topggWebhook = require('./assets/topgg-webhook')
const app = require('./app')

require('events').EventEmitter.defaultMaxListeners = 100

module.exports.getClient = () => { return client };

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
	await guildCreateAndDelete(client)
	await topggWebhook(client)
	await app()
	console.log('ok')
})

// client.on('ready', async () => {
// 	await client.user.setStatus('invisible')
// })

// client.on('guildMemberAdd', member => {
// 	if (member.user.id == '807318024976728085') {
// 		member.kick()
// 		return
// 	}
// })
client.on('ready', async () => {
	if (client.user.id == '780815332834410506')
		return;
	const channel = client.channels.cache.get('846635650186608700')
	const embed = new Discord.MessageEmbed()
		.setAuthor(`Bot is online`, client.user.displayAvatarURL())
		.setColor('BLUE')
		.setTimestamp()
	const msg = await channel.send(embed)
	setInterval(() => {
		msg.edit(embed.setTimestamp())
	}, 5 * 60 * 1000)
})

process.on('unhandledRejection', (reason, promise) => {
	const channel = client.channels.cache.get('857277964021399601')
	if(channel)
	channel.send([`${client.user.username} ERROR\n`, 'Unhandled Rejection at:', `\`\`\`js\n${promise}\`\`\``, 'Reason:', `\`\`\`js\n${reason}\`\`\``])
})

process.on('uncaughtException', (error) => {
	const channel = client.channels.cache.get('857277964021399601')
	if(channel)
	channel.send([`${client.user.username} ERROR\n`, 'Error:', `\`\`\`js\n${error}\`\`\``])
})

client.on('message', async message => {
	if (message.author.bot || !message.guild)
		return;
	const prefix = prefixFinder(message.guild.id)
	const mentionMsg = `Hey <@${message.author.id}>! My prefix is \`${prefix}\` \nRun *\`${prefix}help\`* for more help!`
	const mention = message.content.replace(/ +/g, '')
	if (mention == `<@${client.user.id}>` || mention == `<@!${client.user.id}>`)
		message.channel.send(mentionMsg)
})

// client.on('message', async message => {
// 	if (message.author.id == '697815325650976789') //697815325650976789
// 		return message.delete()
// })

client.on('message', message => {
	if(message.author.bot)
	return;
	console.log('yes')
	const commandBase = require('./commands/command-base.js')

	const prefix = prefixFinder(message.guild.id)
	const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content))
	return console.log('no match');

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	const command = client.commands.find(cmd => cmd.commands.includes(commandName))
	if (!command) {
		return console.log('no command')
	};
	console.log('m')
	commandBase(client, command, message, args, prefix)
})

client.once('ready', async () => {
	console.log('Bot is online')

	const baseFile = 'command-base.js'
	const commandBase = require(`./commands/${baseFile}`)

	// console.log(client.commands)

	const readCommands = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file))
			} else if (file !== baseFile && file !== 'load-commands.js') {
				const option = require(path.join(__dirname, dir, file))
				// commandBase(client, option)
			}
		}
	}

	readCommands('commands')
})

client.login(config.testing_token)
