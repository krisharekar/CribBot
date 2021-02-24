module.exports = {
    commands: ['simjoin'],
    execute(message, args, client) {
      client.emit('guildMemberAdd', message.member)
    }
  }