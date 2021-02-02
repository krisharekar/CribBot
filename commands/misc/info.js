const Discord = require('discord.js')
const { version: djsversion } = require('discord.js')
const { version } = require('../../package.json')
const { utc } = require('moment')
const ms = require('ms')
const os = require('os')

module.exports = {
	commands: ['info', 'botinfo', 'about', 'aboutbot'],
	description: 'Get info about the bot',
	aliases: ['about'],
	usage: '',
	args: false,
	guildOnly: false,

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

		const InfoEmbed = new Discord.MessageEmbed()
			.setTitle('Bot Info')
			.setThumbnail(client.user.displayAvatarURL())
			.setColor('RANDOM')
			.addField('General', [
				`**❯ Client:** ${client.user.tag} (${client.user.id})`,
				`**❯ Commands:** 23`,
				`**❯ Servers:** ${client.guilds.cache.size.toLocaleString()} `,
				`**❯ Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
				`**❯ Channels:** ${client.channels.cache.size.toLocaleString()}`,
				`**❯ Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
				`**❯ Created By:** Krish#7476`,
				`**❯ Node.js:** ${process.version}`,
				`**❯ Version:** v${version}`,
				`**❯ Discord.js:** v${djsversion}`,
				'\u200b'
			])
			.addField('System', [
				`**❯ Platform:** ${process.platform}`,
				`**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
				`**❯ CPU:**`,
				`\u3000 Cores: ${os.cpus().length}`,
				`\u3000 Model: ${core.model}`,
				`\u3000 Speed: ${core.speed}MHz`,
				`**❯ Memory:**`,
				`\u3000 Total: ${totalMemory}`,
				`\u3000 Used: ${memoryUsed}`
			])
			.setFooter('If you find any bugs, report it to Krish')

		message.channel.send(InfoEmbed)
	}
}