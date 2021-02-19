const Discord = require('discord.js')

const loadCommands = require('./load-commands')

const { prefix } = require('../config.json')

module.exports = {
	commands: ['help', 'commands', 'cmds', 'h'],
	description: 'Shows the help menu',
	aliases: ['commands', 'cmds'],
	usage: '',
	maxArgs: 1,

	execute(message, args, client) {
		const commands = loadCommands()

		if (!args.length || args[0] == 'help') {

			let reply = ''

			if (!args.length || args[0] == 'help') {

				const mainCommands = []

				for (const command of commands) {
					// console.log(command[0].commands[0])
					const mainCommand = `\`${command.commands[0]}\``
					mainCommands.push(mainCommand)
				}

				const helpEmbed = new Discord.MessageEmbed()
					.setAuthor(client.user.username, client.user.displayAvatarURL())
					.setTitle('**__Help Menu__**')
					.setColor('RANDOM')
					.setDescription(`**My prefix is \`${prefix}\`**`)
					.addField('Commands:', `${mainCommands.join(' ')}`, true)
					.setFooter(`Type ${prefix}help [command] to get help on a specific command`)

				return message.channel.send(helpEmbed)
			}

			const helpEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setTitle('**__Help Menu__**')
				.setColor('RANDOM')
				.setDescription(`**My prefix is \`${prefix}\`**`)
				.addFields({
					name: 'Commands:', value: `${reply}`, inline: true
				})
				.setFooter(`Type ${prefix}help [command] to get help on a specific command`)

			return message.channel.send(helpEmbed)
		}

		let status = false
		if (args[0]) {
			for (const command of commands) {
				const cmd = args[0]
				const commandAliases = command.commands.includes(args[0])
				const aliases = command.commands.join(', ')

				if (commandAliases) {
					status = true
					const helpEmbed = new Discord.MessageEmbed()
						.setAuthor(client.user.username, client.user.displayAvatarURL())
						.setTitle(`**${cmd.toUpperCase()} Command**`)
						.setColor('RANDOM')
						.setDescription([
							`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Description : **\`${command.description}\``,
							`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Usage      : **\`${prefix}${cmd} ${command.usage}\``,
							`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Aliases       : **\`${aliases}\``						])
						.setFooter(`<> are mandatory, [] are optional`)

					return message.channel.send(helpEmbed)
				}
			}
			if (status == false)
				return message.channel.send(`There is no such command as \`${args[0]}\`.`)
		}
	}
}