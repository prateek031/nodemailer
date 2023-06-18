var express = require("express");
const passport = require("passport");
var router = express.Router();
var userModel = require("./users");
const crypto =require("crypto")
const mailer=require("../nodemailer")

var localStratregy = require("passport-local");
passport.use(new localStratregy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index");
});

router.post("/register", function (req, res, next) {
  var data = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel.register(data, req.body.password)
  .then(function (reg) {
    passport.authenticate("local")(req, res, function(){
        res.redirect("/");
        // console.log(reg);
      });
    })
    .catch(function (e) {
      res.send(e);
    });
});

router.get("/login", function (req, res)
 {
  res.render("login");
});

router.get("/profile",isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (user) {
      res.render("profile", { user });
    });
});

router.post("/login" ,passport.authenticate("local", 
  {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }),
  function (req, res, next) {
    console.log("lol")
   }
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

router.get("/forgetpage", function (req, res)
 {
  res.render("forget");
});

router.post("/forget",async function (req, res)
 {
 var user= await userModel.findOne({email:req.body.email});
 if(user){
  crypto.randomBytes(14,async function(err,buff){

    var token= buff.toString("hex");
    var resp =  mailer(req.body.email, user._id,token)
    user.token=token;
    await user.save();
    res.send("check your mail")
  })
 }
 else{
  res.send("sahi se email dal lawde")
 }
}
);
 
router.get("/reset/:userid/:token", async function (req, res)
 {
  res.render("reset",{id:req.params.userid});
});

router.post("/reset/:userid", async function (req, res)
 {
 var user= await userModel.findOne({_id:req.params.userid})
    if (user)
    {
      console.log(req.body.password)
        user.setPassword(req.body.password, async function(err,usr)
        {
          if(err) console.log(err)
          else console.log(usr)
          await usr.save()
          res.redirect("/login")
        })
      }
    else 
     {
        res.status(500).json
        (
          {
            message: 'This user does not exist'
          }
        );
    }

});



module.exports = router;
