const fetch = require('node-fetch')
module.exports = {
    commands: ['test'],
    
    async execute(message, args) {
        const result = await fetch('https://stackoverflow.com/questions/60883461/typeerror-member-guild-channels-get-is-not-a-function')
        console.log(result)
        console.log(result.headers)
    }
}