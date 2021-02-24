module.exports = {
    commands: ['insult', 'roast'],
    description: 'Insults a user (pretty offensive).',
    aliases: ['roast'],
	usage: '',

    execute(message, args) {

        const member = message.mentions.members.first() || message.author

        const insults = ["You're so fat that when you farted you started global warming.", "You bring everyone a lot of joy, when you leave the room.", "Keep rolling your eyes, perhaps you'll find a brain back there.", "Is that your face? Or did your neck just throw up?", "You're so fat when you get on the scale it says \"To be continued.\"", "You're so fat you have your own zip code.", "You're so ugly you make blind kids cry.", "They say opposites attract. I hope you meet someone who is good-looking, intelligent, and cultured.", "I'd call you a tool, but that would imply you were useful in at least one way.", "You're so dumb that you got hit by a parked car.", "I heard you went to a haunted house and they offered you a job.", "At least when I do a handstand my stomach doesn't hit me in the face.", "You're so ugly that even Scooby Doo couldn't solve that mystery.", "I'm jealous of all the people that haven't met you.", "You're so fat I took a picture of you at Christmas and it's still printing.", "I fart to make you smell better.", "I would agree with you but then we would both be wrong.", "Your birth certificate is an apology letter from the condom factory.", "Roses are red violets are blue, God made me pretty, what happened to you?", "You're so fat Mount Everest tried to climb you.", "Yo Mama so fat that even Dora couldn't explore her.", "Ordinarily people live and learn. You just live.", "You're so fat, a picture of you would fall off the wall!", "I don't exactly hate you, but if you were on fire and I had water, I'd drink it.", "I'd give you a nasty look but you've already got one.", "It looks like your face caught on fire and someone tried to put it out with a hammer.", "Even if you were twice as smart, you'd still be stupid!", "You're so fat when you turn around, people throw you a welcome back party.", "Looks like you fell off the ugly tree and hit every branch on the way down.", "If you really want to know about mistakes, you should ask your parents.", "If I ate a bowl of alphabet soup, I could shit out a smarter sentence than any of yours.", "Looks aren't everything; in your case, they aren't anything.", "Brains aren’t everything. In fact, in your case they’re nothing."]

        const random = Math.floor(Math.random() * insults.length)
        const reply = insults[random]

        if (member.id === '714808648517550144') {
            if (Math.floor(Math.random() * 100) === 7)
                message.channel.send(`${member} What a turn of events. I'm gonna be insulting you master. ${reply}.~~forgive me for this~~`)

            else
                message.channel.send(`${message.author} no u.`)
        }
        else
        message.channel.send(`${member} ${reply}`)
    }
}