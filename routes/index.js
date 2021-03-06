var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Blog = require("../models/blog");
var User = require("../models/user");
var emailer = require("../public/scripts/notifications/email.js")


router.get("/", function(req,res){
  Blog.findOne(
    {catagory: "Programming Projects"})
    .populate({path:"blogposts", options:{ sort:{spot:1}}})
    .exec( function(err,webProjects){
      if(err){
        console.log(err);
      } else{

        Blog.findOne(
          {catagory: "Tigers"})
          .populate({path:"blogposts", options:{ sort:{spot:1}}})
          .exec( function(err,gameProjects){
            if(err){
              console.log(err);
            } else{
              res.render("index",{catagory: "Tigers" ,portfolioWeb:webProjects, portfolioGame:gameProjects});
            }
          });
        }
    });
});

router.get("/register", function(req,res){
  res.render("register");
});

router.post("/loginOrRegister", function(req,res){
  if(req.body.action == "login"){

    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully Signed In! Welcome back " + req.body.username);
      return res.redirect('back');
    });

  }else {
    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Failed to register");
            return res.redirect('back');
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
          return res.redirect('back');
        });
    });

  }
});

router.get("/login", function(req,res){
  res.render("login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true,
    successFlash:"Login successful"
  }), function(req,res){
});

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success","Bye, Thanks for visiting!");
  res.redirect("/");
});

router.post("/contact",   function(req, res){
  email = {
    name:req.body.name,
    company:req.body.company,
    email:req.body.email,
    message:req.body.message,
    telephone:req.body.phone
  };
  emailer.sendEmail(email);
  req.flash("success","Email sent");
  res.redirect("/#contact");
});

router.get("/c/:company", function(req,res){
  res.render("company");
});

module.exports = router;
