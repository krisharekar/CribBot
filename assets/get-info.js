const fs = require('fs')

module.exports.getInfo = (item) => {
    const path = './assets/items.json'

    const rawData = fs.readFileSync(path, 'utf-8')
    let data = JSON.parse(rawData)
    const itemInfo = data.find(data => data.id == item, 'utf-8')

    if(!itemInfo)
    throw new TypeError(`Item \`${item}\` not found.`)

    return itemInfo
}