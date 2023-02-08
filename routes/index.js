var express = require("express");
var router  = express.Router();
var emailer = require("../public/scripts/notifications/email.js")


router.get("/", function(req,res){
    res.render("index");
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

module.exports = router;
