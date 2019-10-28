var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true, trim: true},
  _id: {type: String, required: true, trim: true},
  description: {type: String, required: true, trim: true},
  duration: {type: Number, required: true},
  date: {type: Date},
  to: {type: Date},
  from: {type: Date},
  limit: {type: Number},
  log: {type: Array, max: 100}
}, {"validateBeforeSave": false});



module.exports = mongoose.model("User", userSchema);
