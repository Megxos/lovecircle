const express = require("express"),
            ejs = require("ejs"),
            mongoose = require("mongoose"),
            bodyParser = require("body-parser"),
            User = require("./models/user"),
            Message = require("./models/messages"),
            Personal = require("./models/personal"),
            passport = require("passport"),
            passport_local = require("passport-local"),
            passport_local_mongoose = require("passport-local-mongoose"),
            methodOverride = require("method-override"),
            flash = require("connect-flash")

mongoose.connect(
  "mongodb://heroku_l6g2k9tp:3hsbd1n3508f42o8097548aeal@ds141410.mlab.com:41410/heroku_l6g2k9tp",
  {
    useNewUrlParser: true,
  }
);

// mongoose.connect("mongodb://localhost/loveCircle")

//configure express
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "I'm a new user",
    resave: false,
    saveUninitialized: false
}))

//User Authentication config
passport.use(new passport_local(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})
//home route to facebook
app.get("/", function(req, res){
    res.redirect("/lovecircle")
})
//login in route
app.get("/login", function(req, res){
    res.render("login")
})

app.post("/login",checkCase,passport.authenticate("local", 
    {
    successRedirect: "/lovecircle",
    failureRedirect: "/login"
    }), function (req, res) { 
})

app.get("/signup", function (req, res) {
    res.render("signup")
})
app.post("/register", checkCase,function(req, res){
    var username  = req.body.username
    console.log(username)
    var password = req.body.password
    //save in personal database with unhashed password
    Personal.create({username: username, password: password})
    newUser = new User({username: username})

    //save in  database with hashed password
    User.register(newUser, password, function (err, result) {
        if (err) {
            var error = err.message
            req.flash("error", err.message)
            return res.redirect("back")
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "You Signed Up Successfully!")
                res.redirect("/lovecircle")
            })
        }
});
})

function checkCase(req,res, next){
    var received = req.body.username.toLowerCase()
    req.body.username = received
    next()
}

app.get("/lovecircle",function(req, res){
    var currentUser = req.user
    if (currentUser != undefined){
        User.findOne({ username: currentUser.username }, function(err, success){
            if(err){
                req.flash("error", "Sorry we couldn't fetch your messages at the moment. Pls try logging in")
                return  res.redirect("/login")
            }else{
                var messages = success.messages;
                var messages_length = messages.length;
                res.render("loveCircle", {
                  user: currentUser.username,
                  messages: messages,
                  messages_length: messages_length,
                });
            }
        })
    }else{
    var user = "Guest"
    res.render("loveCircle", {user: user, messages_length: 0})
    }
})

app.post("/lovecircle/:user/message",function(req, res){
    name = req.body.name
    message = req.body.message
   newMessage = new Message({from: name, message: message, to: req.body.to})
   Message.create(newMessage, function(err, success){
       if(err)
            console.log(err)
        User.findOne({ username: req.body.to}, function(failed, successful){
            if(failed){
                req.flash("error", "Sorry that user doesn't exist!")
                return res.redirect("/lovecircle")
            }else{
                if(successful == null){
                    req.flash("error", "Sorry that user doesn't exist!");
                    return res.redirect("/lovecircle");
                }
                 successful.messages.push(success);
                 successful.save(function (err, saved) {
                   if (err) console.log(err);
                   req.flash("success", "message sent to " + req.body.to)
                 res.redirect("/lovecircle");
                 });
            }
        })
   })
})


app.get("/logout", function(req, res){
    req.logOut()
    req.flash("error", "Oh No! You've logged out!")
    res.redirect("/login")
})

//middleware is check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You are not logged in, please login first!")
    res.redirect("/login")
}

app.get("/termsofservice", function(req, res){
    res.render("termsofservice")
})

app.listen(process.env.PORT || 4000, function(){
    console.log("server started >>>")
})