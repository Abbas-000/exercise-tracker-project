var express = require("express");
var router = express.Router();
var User = require("../schema/model");
var shortid = require("shortid");


router.post("/api/exercise/new-user", (req, res) => {
  let username = new User({username: req.body.username, _id: shortid.generate(), log: []});
  username.save((e, username) => {
    if(e) return res.send("username already takken");
    res.json({username: username.username, _id: username._id})
  })
});

router.post("/api/exercise/add", (req, res) => {
  let userid = req.body.userId;
  let date, description, duration;
  req.body.date ? date = req.body.date : date = new Date();
  description = req.body.description;
  duration = req.body.duration;
  let update = {description, duration, date};
  let test = User.findById(userid).exec(function(e, doc) {
    if (doc == null) return res.send("unknown _id");
    let log = doc.log;
    log.push(update);
    let limit = log.length;
    update = {...update, log, limit};
    updateuser(update);
  });
  function updateuser(update) {
    User.findOneAndUpdate({"_id": userid}, update, {new: true, runValidators: true}, (err, result) => {
      if (err) return res.send(err.message);
      if (result == null) {
        return res.send("unknown _id");
      } else {
        res.json({username: result.username, description: result.description, duration: result.duration, date: result.date.toDateString(), _id: result._id})
      }
    });
  }
})

router.get("/api/exercise/users", (req, res) => {
  User.find({}, (e, obj) => {
    var allUsers = [];
    obj.forEach(o => {
      allUsers.push({username: o.username, _id: o._id, __v: o.__v});
    });
    res.send(allUsers);
  });
});

router.get("/api/exercise/log", (req, res) => {
  let userId = req.query.userId;
  let from = req.query.from;
  let to = req.query.to;
  let limit = +req.query.limit;
  User.findById(userId, (e, user) => {
    if (user == null) return res.send("not found");
    from = user.log.find(item => item.date == from);
    (from == undefined) ? from = user.log[0] : from;
    to = user.log.find(item => item.date == to);
    (to == undefined) ? to = user.log[user.log.length-1] : to;
    let logData = user.log.slice(user.log.indexOf(from), user.log.indexOf(to) + 1);
    if (limit) {
      logData.splice(limit);
    }
    (limit) ? limit : limit = logData.length;
    res.json({userId: user._id, username: user.username, from: req.query.from, to: req.query.to, count: limit, log: logData});
  });
});


module.exports = router;
