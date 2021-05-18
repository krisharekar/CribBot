/**
 * 
 * @param {Number} coins 
 */

module.exports.taxCalc = (coins) => {
    if(isNaN(coins))
    throw new TypeError('Coins and Tax rate must be a number.')

    const taxRate = 8
    const amountLost = Math.round(coins * (taxRate/100))
    const amountRecieved = Math.round(coins - amountLost)
    const amountToBePaid = Math.round(coins/((100-taxRate)/100))

    const taxCalc = {
        amountLost,
        amountRecieved,
        amountToBePaid
    }

    return taxCalc
}