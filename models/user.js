var mongoose = require("mongoose"),
        Messages = require("./messages"),
        passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
        username: String,
        password: String,
        messages: [ messageSchema ]
})
userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema)