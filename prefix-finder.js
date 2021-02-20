const fs = require('fs')

module.exports.prefixFinder = (guildId) => {
    const config = require('./config.json')
    const path = './commands/misc/prefix.json'
    const rawData = fs.readFileSync(path, 'utf-8')
    const data = JSON.parse(rawData)
    const guildData = data.find(data => data.guildId == guildId, 'utf-8')

    if (!guildData)
        return config.prefix

    return guildData.prefix
}