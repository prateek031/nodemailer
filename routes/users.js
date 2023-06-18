const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.set('strictQuery', false);

mongoose.connect("mongodb://0.0.0.0:27017/passport")
  .then(function () {
    console.log("connected");
  })


var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema)
