const Discord = require('discord.js')

module.exports = {
    commands: ['eval', 'run'],
    description: 'Evals the code',
    ownerOnly: true,

    async execute(message, args, client) {
        let result, toEval = args.join(' ')
        if (!toEval.toLowerCase().includes('return')) toEval = 'return ' + toEval
        try { result = await eval('(async () => {' + toEval + '})()') } catch (e) { result = (e) }
        if (typeof result === 'object') if (Promise && Promise.resolve) await Promise.resolve(result)
        if (typeof result === 'object') result = JSON.stringify(result)
        result.length > 1900 ? result = result.substring(0, 1900) + '...' : result

        let description = `**Ran:**\n\`\`\`js\n${toEval}\n\`\`\`\n**Result:**\n\`\`\`js\n${result}\n\`\`\``
        if (typeof result !== 'undefined') description += `\n**Type:**\n\`\`\`js\n${typeof result}\n\`\`\``
        let embed = new Discord.MessageEmbed()
            .setColor('2F3136')
            .setDescription(description)
        await message.channel.send(embed)
    }
}