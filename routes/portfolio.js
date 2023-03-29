var express = require("express");
var router  = express.Router();


//index
router.get("/", function(req,res){
    res.render("index");
});

router.get("/CupCakeMage", function(req,res){
    res.render("sections/Portfolios/Full Page/CupCakeMage");
});

router.get("/RollingInTheSheep", function(req,res){
    res.render("sections/Portfolios/Full Page/RollingInTheSheep");
});

router.get("/TheSorrowOfSilk" , function(req,res){
    res.render("sections/Portfolios/Full Page/TheSorrowOfSilk");
});

module.exports = router;