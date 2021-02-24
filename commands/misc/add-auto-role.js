const Discord = require('discord.js')
const autoRoleSchema = require('../../schemas/autorole-schema')
const { loadAutoRoleData } = require('../../cache/auto-role-cache')

module.exports = {
    commands: ['add-auto-role', 'addautorole'],
    description: 'Add auto roles to be given when someone joins the server',
    minArgs: 1,
    usage: '<role>',
    permissions: ['MANAGE_ROLES'],

    async execute(message, args) {
        const guildId = message.guild.id
        const role = message.mentions.roles.first() || message.guild.roles.autoRoleCache.get(args[0]) || message.guild.role.autoRoleCache.find(r => r.name == args.join(' '))

        if (!role)
            return message.channel.send('Specify a role that exists.')

        const result = await autoRoleSchema.findOne({ guildId })

        if (result && result.roles.includes(role.id))
            return message.channel.send(`Auto role with \`${role.name}\` role already exists.`)

        await autoRoleSchema.findOneAndUpdate({ guildId }, { $push: { roles: role.id } }, { upsert: true })

        await loadAutoRoleData()

        const embed = new Discord.MessageEmbed()
            .setAuthor('Auto-role added', message.guild.iconURL({ dynamic: true }))
            .setColor('GREEN')
            .setDescription(`Added auto-role <@&${role.id}>`)
            .setFooter(`Added by ${message.author.tag}`)

        message.channel.send(embed)
    }
}