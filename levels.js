const mongo = require('./mongo')
const levelSchema = require('./z-archived/schemas/level-schema')

module.exports = (client) => {
    client.on('message', message => {
        if (message.author.bot)
            return

        const { guild, member } = message

        const randomXP = Math.floor((Math.random() * (25 - 10)) + 1) + 10 //random xp between 10-25
        console.log('xp:' + randomXP)

        addXP(guild.id, member.id, randomXP, message) //every 1 minute
    })
}

const getNeededXP = level => level * 100

const addXP = async (guildId, userId, xpToAdd, message) => {

    const result = await levelSchema.findOneAndUpdate({
        guildId,
        userId
    },
        {
            guildId,
            userId,
            $inc: {
                xp: xpToAdd
            }
        },
        {
            upsert: true,
            new: true,
        })

    let { xp, level } = result
    nextLevel = level++
    const needed = getNeededXP(nextLevel)
    console.log('level:' + needed)

    if (xp >= needed) {
        level++
        xp -= needed

        message.channel.send(`Congrats ${message.member}!. You leveled up. You are now level ${level}.`)

        await levelSchema.updateOne({
            guildId,
            userId
        },
            {
                level,
                xp
            })
    }
}