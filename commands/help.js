const Discord = require('discord.js')
const loadCommands = require('./load-commands')

module.exports = {
	commands: ['help', 'commands', 'cmds', 'h'],
	description: 'Shows the help menu',
	usage: '',

	execute(message, args, client, prefix) {
		let { commands } = client
		commands = commands.array().filter(key => { return key.module != 'owner-only'})

		if (!args.length || args[0] == 'help') {

			let reply = ''
			const temp = commands
			// console.log(temp)
			// console.log(temp[0])
			// console.log(temp.sort((a, b) => { return b[0].length - a[0].length })[0])
			const highestLength = (temp.sort((a, b) => { return b.commands[0].length - a.commands[0].length }))[0].commands[0].length
			const mainCommands = []
			let modules = []
			const allCommands = new Discord.Collection()
			const cmds = []

			for (const command of commands) {
				// console.log(command)
				if (!modules.includes(command.module))
					modules.push(command.module)

				const mainCommand = {
					cmdName: command.commands[0],
					desc: command.description,
					module: command.module
				}

				cmds.push(mainCommand)
				allCommands
				const text = `\`${command.commands[0].padEnd(highestLength + 1)}:\` ${command.description}\n`
				const text2 = allCommands.get(command.module)
				const newText = text2 ? text2 + text : text
				// console.log(command.module)
				allCommands.set(command.module, newText)
				// console.log(allCommands.get(command.module))
			}

			modules = modules.sort((a, b) => { return a.localeCompare(b) })
			const helpEmbed = new Discord.MessageEmbed()
				.setAuthor('Help Menu', client.user.displayAvatarURL())
				.setColor('BLUE')
				.setDescription([`My prefix is \`${prefix}\``,
					`[Click here to join the support server](https://discord.gg/cpWeW7apHD)`])
				.setFooter(`Type ${prefix}help [command] to get help on a specific command`)

			for (const moduleName of modules) {
				const result = allCommands.get(moduleName)
				// console.log(moduleName, result.length)
				helpEmbed.addField(moduleName == '.' ? 'Help' : capitalizeFirstLetter(moduleName), result)
			}

			return message.channel.send(helpEmbed)


			// const helpEmbed = new Discord.MessageEmbed()
			// 	.setAuthor(client.user.username, client.user.displayAvatarURL())
			// 	.setTitle('**__Help Menu__**')
			// 	.setColor('RANDOM')
			// 	.setDescription(`**My prefix is \`${prefix}\`**`)
			// 	.addFields({
			// 		name: 'Commands:', value: `${reply}`, inline: true
			// 	})
			// 	.setFooter(`Type ${prefix}help [command] to get help on a specific command`)

			// return message.channel.send(helpEmbed)
		}

		let status = false
		if (args[0]) {
			const cmd = args[0].toLowerCase()
			const commandDetails = commands.find(key => key.commands.includes(cmd))

			if (!commandDetails)
				return message.channel.send(`There is no such command as \`${args[0]}\`.`)

			const mainCommand = commandDetails.commands[0].replace(/-/g, ' ')
			const description = commandDetails.description
			const aliases = commandDetails.commands.join(', ')
			const usage = commandDetails.usage ? ` ${commandDetails.usage}` : ''
			const permissions = commandDetails.permissions

			// const desc = [
			// 	`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Description : **\`${description}\``,
			// 	`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Usage      : **\`${prefix}${cmd}${usage}\``,
			// 	`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Aliases       : **\`${aliases}\``,
			// 	`${permissions ? `**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Permission   : **\`${permissions}\`` : ''}`
			// ]

			const desc = [
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Description : **\`${description}\``,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Usage                  : **\`${prefix}${cmd}${usage}\``,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Aliases               : **\`${aliases}\``,
				`${permissions ? `**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Permission   : **\`${permissions}\`` : ''}`
			]

			const helpEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setColor('BLUE')
				.addField(`${capitalizeWords(mainCommand)} Command`, desc)
				.setFooter(`<> are mandatory, [] are optional`)

			return message.channel.send(helpEmbed)
		}
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWords(string) {
	return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};