const path = require('path')
const fs = require('fs')

module.exports = (client) => {
    const readCaches = async (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCaches(path.join(dir, file))
            } else if (file !== 'load-caches.js') {
                const cache = require(path.join(__dirname, dir, file))
                // console.log(`Enabling cache "${file}"`)
                await cache.loadCache()
            }
        }
    }

    readCaches('.')
}