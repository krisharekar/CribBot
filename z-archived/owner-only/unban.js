module.exports = {
    commands: ['unbanall'],
    ownerOnly: true,

    async execute(message, args) {
        let banCount
        message.guild.fetchBans().then(bans => {
            banCount = bans.size
            bans.forEach(u => {
                message.guild.members.unban(u.user)
            })
        })
        message.channel.send(`Unbanned **${banCount}** members.`)
    }
}