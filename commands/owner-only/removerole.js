module.exports = {
  commands: ['removerole', 'delrole', 'deleterole'],
  description: 'Removes a role from a user',
  aliases: ['delrole', 'deleterole'],
  usage: '<user> <role-name>',
  permissions: ['MANAGE_ROLES'],


  execute(message, args) {
    if (message.member.hasPermission('MANAGE_ROLES')) {
      const targetUser = message.mentions.users.first()
      if (!targetUser) {
        message.reply('Please specify someone to remove a role from.')
        return
      }

      if(message.member.roles.highest.position < targetUser.roles.highest.position)
      return message.channel.send('You cannot remove a role from a member who has a higher role than you.')

      args.shift()

      const roleName = args.join(' ')
      const { guild } = message

      const role = guild.roles.cache.find((role) => {
        return role.name.ignoreCase === roleName.ignoreCase
      })
      if (!role) {
        message.reply(`There is no role with the name "${roleName}".`)
        return
      }

      const member = guild.members.cache.get(targetUser.id)
      if (member.roles.cache.get(role.id)) {

        try {
          member.roles.remove(role.id).then(message.channel.send(`Removed "${roleName}" from ${targetUser}.`))
        } catch (err) {
          if (err)
            return message.channel.send("I do not have permissions to remove that role, it is either because that role is higher than mine or I do not do not have the 'Manage Roles' permission.")
        }

      }
      else {
        message.reply(`That user does not have "${roleName}" role.`)
      }
    }
    else {
      message.reply('You do not have permissions to use this command.')
    }
  }
}