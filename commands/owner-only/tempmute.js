module.exports = {
 
    commands: "tempmute",
    description: "Mute qyelqu'un pendant une raison défini",
    usage: "/tempmute <user> <time> <reason>",
    category: "moderation",
async execute(client, message, args) {
 
if(!message.member.hasPermission("MANAGE_ROLES", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("Tu n'as pas la permission de faire ca.");
 
if(!message.guild.me.message.member.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Je n'ai pas la permission d'ajouté des rôles")
 
//define the reason and mutee
let time = args[1];
let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!mutee) {
    return message.channel.send("Mentionne la personne que tu veux mute")
    .then(m => m.delete(10000));
  }
  if (mutee.id === message.author.id) {
        return message.reply("Tu ne peux pas te mute tous seul...")
            .then(m => m.delete(10000));
    }
 
 
 
let reason = args.slice(2).join(" ");
if(!reason) reason = "Aucune raison donné"
 
let muterole = message.guild.roles.find(r => r.name === "Criminel")
if(!muterole) {
try{
    muterole = await message.guild.createRole({
        name: "muted",
        color: "#514f48",
        permissions: []
    })
    message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SEND_TTS_MESSAGES: false,
            ATTACH_FILES: false,
            SPEAK: false
        })
    })
} catch(e) {
    console.log(e.stack);
}
}
 
 
mutee.addRole(muterole.id).then(() => {
message.delete()
mutee.send(`Salut, tu as été mute dans le serveur \`${message.guild.name}\`\nRaison: \`${reason}\`\nTemps: \`${ms(ms(time))}\``).catch(err => console.log(err))
 
})
setTimeout(function(){
mutee.removeRole(muterole.id)
mutee.send(`Tu as été unmute de \`${message.guild.name}\``)
 
 
 
}, ms(time))
 
 
 
message.channel.send(`${mutee.user.tag} a été mute pour ${ms(ms(time))}`)
}}