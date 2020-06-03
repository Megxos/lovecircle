var mongoose = require("mongoose")

messageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    timeStamp: {
        type: Date, default: Date.now()
    }
})

module.exports = mongoose.model("message", messageSchema)