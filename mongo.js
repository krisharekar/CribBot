const mongoose = require('mongoose')

module.exports = async () => {
    await mongoose.connect(process.env.MONGODB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    return mongoose
}