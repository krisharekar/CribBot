const { prefix } = require('./config.json')

module.exports = async (client) => {
    const serverCount = client.guilds.cache.size
    await client.user.setActivity(`${prefix}help | ${serverCount.toLocaleString()} servers`, { type: `PLAYING` });
    setInterval(async () => {
        const serverCount = client.guilds.cache.size
        await client.user.setActivity(`${prefix}help | ${serverCount.toLocaleString()} servers`, { type: `PLAYING` });
        console.log('set status')
    }, 10 * 60 * 1000);
}
