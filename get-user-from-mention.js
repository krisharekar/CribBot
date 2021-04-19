const { getClient } = require('./index')
const client = getClient()

module.exports = function getUserFromMention(mention, guildId) {
	if (!mention) return;
	const guild = client.guilds.cache.get(guildId)

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return guild.members.cache.get(mention);
	}
}