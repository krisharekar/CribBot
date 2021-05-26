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
			.setColor('BLUE')
			.addField('General', [
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Bot:** ${client.user.tag} (${client.user.id})`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Commands:** ${client.commands.size}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Servers:** ${client.guilds.cache.size.toLocaleString()} `,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Created By:** ${owner.tag}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Developed By:** ${owner.tag}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Node.js:** ${process.version}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Discord.js:** v${djsversion}`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ) Version:** v${version}`,
				'\u200b'
			])
			.addField('Links', [
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** [Bot's Invite Link](https://discord.com/oauth2/authorize?client_id=744210245403934780&permissions=4294967287&scope=bot)`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** [Bot's Invite Link (admin)](https://discord.com/api/oauth2/authorize?client_id=744210245403934780&permissions=8&scope=bot)`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** [Bot's Support Server](https://discord.gg/cpWeW7apHD)`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** [Vote the Bot on Top.gg](https://top.gg/bot/744210245403934780/vote)`,
				`**[•](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** [Vote the Bot on Discord Bot List](https://discordbotlist.com/bots/crib-bot/upvote)`]
			)

		message.channel.send(InfoEmbed)
	}
}