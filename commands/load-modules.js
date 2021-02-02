const path = require('path')

const fs = require('fs')

module.exports = (client) => {
    const modules = []

    const readModules = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory())
                modules.push(file)
        }
    }

    readModules('.')

    return modules
}