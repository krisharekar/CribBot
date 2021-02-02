const mongoose = require('mongoose')
const mongo = require('../../mongo')

const coinsCache = {}

const profileSchema = require('../../schemas/profile-schema')

module.exports = {}

module.exports.addCoins = async (guildId, userId, coins) => {
    return await mongo().then(async (mongoose)=> {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId, 
                userId   
            },
            {
                guildId,
                userId,
                $inc: {
                    coins
                }
            },
            {
                upsert: true,
                new: true
            })

            //coinsCache[`${guildId}-${userId}`] = result.coins

            return result.coins

        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.getCoins = async (guildId, userId) => {

    /*const cachedValue = coinsCache[`${guildId}-${userId}`]
    if(cachedValue){
        return cachedValue
    }*/

    return await mongo().then(async (mongoose) => {
        try {
            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            let coins = 500
            if(result){
                coins = result.coins
            }
            else {
                console.log('New User Created')
                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }

            //coinsCache[`${guildId}-${userId}`] = coins

            return coins
        } finally {
            mongoose.connection.close()
        }
    })
}