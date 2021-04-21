module.exports.abbNum = (num) => {
    num = num.toString()
    console.log(num)
    if(!isNaN(num) && !num.includes('e')) {
        console.log(num)
        return parseInt(num);
    }
    
    num = num.toLowerCase()
    num = num.replace(/,/g, '')
    console.log(parseFloat(num))

    let number = num
    let temp
    let temp2

    if ((num.includes('k') && num.includes('m')) || (num.includes('k') && num.includes('b')) || (num.includes('m') && num.includes('b')))
        return NaN;

    if (num.includes('k')) {
        temp = num.substring(0, num.indexOf('k'))
        temp2 = num.substring(num.indexOf('k') + 1)
        number = parseFloat(temp) * 1000 + temp2
    }

    if (num.includes('m')) {
        temp = num.substring(0, num.indexOf('m'))
        temp2 = num.substring(num.indexOf('m') + 1)
        number = parseFloat(temp) * 1000000 + temp2
    }

    if (num.includes('b')) {
        temp = num.substring(0, num.indexOf('b'))
        temp2 = num.substring(num.indexOf('b') + 1)
        number = parseFloat(temp) * 1000000000 + temp2
    }
    console.log(number)
    if (number.includes('e')) {
        let temp = number.split('e')
        number = temp[0] * Math.pow(10, temp[1])
    }
    console.log(number)
    number = parseInt(number)
    return number
}