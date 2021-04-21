const Discord = require('discord.js')
const { version: djsversion } = require('discord.js')
const { version } = require('../../package.json')
const { utc } = require('moment')
const ms = require('ms')
const os = require('os')

module.exports = {
	commands: ['info', 'botinfo', 'about', 'aboutbot'],
	description: 'Get info about the bot',

	execute(message, args, client) {

		let totalMemory
		let memoryUsed
		let sizes
		let i

		let bytes = process.memoryUsage().heapTotal
		if (bytes === 0)
			return totalMemory = '0 Bytes';
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		i = Math.floor(Math.log(bytes) / Math.log(1024));
		totalMemory = `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;

		bytes = process.memoryUsage().heapUsed
		if (bytes === 0)
			return memoryUsed = '0 Bytes';
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		i = Math.floor(Math.log(bytes) / Math.log(1024));
		memoryUsed = `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;

		const core = os.cpus()[0];
		const owner = client.users.cache.get('714808648517550144')

		const InfoEmbed = new Discord.MessageEmbed()
			.setTitle(client.user.username)
			.setThumbnail(client.user.displayAvatarURL())
			.setColor('RANDOM')
			.addField('General', [
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Client:** ${client.user.tag} (${client.user.id})`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Commands:** ${client.commands.size}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Servers:** ${client.guilds.cache.size.toLocaleString()} `,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Channels:** ${client.channels.cache.size.toLocaleString()}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Created By:** ${owner.tag}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Node.js:** ${process.version}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Version:** v${version}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Discord.js:** v${djsversion}`,
				'\u200b'
			])
			.addField('System', [
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Platform:** ${process.platform}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) CPU:**`,
				`\u3000 Cores: ${os.cpus().length}`,
				`\u3000 Model: ${core.model}`,
				`\u3000 Speed: ${core.speed}MHz`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Memory:**`,
				`\u3000 Total: ${totalMemory}`,
				`\u3000 Used: ${memoryUsed}`
			])
			.setFooter('If you find any bugs, report it to Krish')

		message.channel.send(InfoEmbed)
	}
}