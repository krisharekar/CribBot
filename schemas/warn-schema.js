const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const warnSchema = mongoose.Schema({
  guildId: reqString,
  guildName: reqString,
  userId: reqString,
  userName: reqString,
  totalWarnings : {
      type: Number,
      required: true
  },
  warnings: {
    type: [Object],
    required: true,
  },
})

module.exports = mongoose.model('warnings', warnSchema)