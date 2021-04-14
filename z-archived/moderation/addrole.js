module.exports = {
  commands: ['giverole', 'addrole'],
  description: 'Gives the user the role',
  aliases: ['giverole'],
  usage: '<user> <role-name>',
  minArgs: 2,

  execute(message, args) {
    if (message.member.hasPermission('MANAGE_ROLES') && !message.author.id !== '714808648517550144') {
      const targetUser = message.mentions.users.first()
      if (!targetUser) {
        return message.reply('Please specify someone to give a role to.')
      }

      args.shift()

      var roleName = args.join(' ')
      const { guild } = message

      var role

      role = guild.roles.cache.find((role) => {
        return role.name === roleName
      })
      if (!role) {

        roleName = roleName.toUpperCase()
        role = guild.roles.cache.find((role) => {
          return role.name === roleName
        })
        if (!role) {
          roleName = roleName.toLowerCase()
          role = guild.roles.cache.find((role) => {
            return role.name === roleName
          })
        }

        if (!role)
          return message.reply(`There is no role with the name "${roleName}".`)
      }

      const member = guild.members.cache.get(targetUser.id)
      if (member.roles.cache.get(role.id)) {
        message.reply(`${targetUser} already has "${roleName}" role.`)
      }
      else {
        try {
          member.roles.add(role.id).then(message.channel.send(`Added "${roleName}" to ${targetUser}.`))
        } catch(err){
          if(err) 
          return message.channel.send("I do not have permissions to give that role, it is either because that role is higher than mine or I do not do not have the 'Manage Roles' permission.")
        }
      }
    }
    else {
      message.reply('You do not have permissions to use this command.')
    }
  }
}