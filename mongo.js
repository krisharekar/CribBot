const mongoose = require('mongoose')

module.exports = async () => {
    await mongoose.connect('mongodb+srv://Krish:KrishCribBot123@bot.dl9uq.mongodb.net/data', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    return mongoose
}