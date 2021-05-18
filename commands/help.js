const Discord = require('discord.js')
const loadCommands = require('./load-commands')

module.exports = {
	commands: ['help', 'commands', 'cmds', 'h'],
	description: 'Shows the help menu',
	aliases: ['commands', 'cmds'],
	usage: '',
	maxArgs: 1,

	execute(message, args, client, prefix) {
		const { commands } = client

		if (!args.length || args[0] == 'help') {

			let reply = ''
			const temp = Array.from(commands)
			// console.log(temp[0])
			const highestLength = (temp.sort((a, b) => { return b[0].commands[0].length - a[0].commands[0].length })).slice(0, 1)[0][0].commands[0].length
			// console.log(highestLength)
			const mainCommands = []
			const modules = []
			const allCommands = new Discord.Collection()
			const cmds = []

			for (const command of commands) {
				if (!modules.includes(command[0].module))
					modules.push(command[0].module)

				const mainCommand = {
					cmdName: command[0].commands[0],
					desc: command[0].description,
					module: command[0].module
				}

				cmds.push(mainCommand)
				allCommands
				const text = `\`${command[0].commands[0].padEnd(highestLength + 1)}:\` ${command[0].description}\n`
				const text2 = allCommands.get(command[0].module)
				const newText = text2 ? text2 + text : text
				// console.log(command.module)
				allCommands.set(command[0].module, newText)
				// console.log(allCommands.get(command.module))
			}
			// return console.log(modules)
			// for (const command of commands) {
			// 	// console.log(command[0].commands[0])
			// 	const mainCommand = {
			// 		cmdName: command[0].commands[0],
			// 		desc: command[0].description
			// 	}
			// 	mainCommands.push(mainCommand)
			// }

			// for (const cmd of allCommands) {
			// 	reply += `\`${cmd.cmdName.padEnd(highestLength+1)}:\` ${cmd.desc}\n`
			// }
			// console.log(reply.length)

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
			for (const command of commands) {
				const cmd = args[0]
				const mainCommand = command[0].commands[0].replace(/-/g, ' ')
				const description = command[0].description
				const commandAliases = command[0].commands.includes(args[0])
				const aliases = command[0].commands.join(', ')
				const usage = command[0].usage ? ` ${command[0].usage}` : ''
				const permissions = command[0].permissions

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


				if (commandAliases) {
					status = true
					const helpEmbed = new Discord.MessageEmbed()
						.setAuthor(client.user.username, client.user.displayAvatarURL())
						.setColor('BLUE')
						.addField(`${capitalizeWords(mainCommand)} Command`, desc)
						.setFooter(`<> are mandatory, [] are optional`)

					return message.channel.send(helpEmbed)
				}
			}
			if (status == false)
				return message.channel.send(`There is no such command as \`${args[0]}\`.`)
		}
	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWords(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};