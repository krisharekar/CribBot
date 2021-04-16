const { updateHighestDonorChannel } = require('./coin-donations')

module.exports = async (client) => {
    setInterval(() => {
		client.guilds.cache.forEach(async g => {
			updateHighestDonorChannel(client, g.id)
		})
	}, 5 * 60 * 1000)
}