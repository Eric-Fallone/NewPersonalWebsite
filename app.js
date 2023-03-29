var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    methodOverride = require("method-override"),
    normalizePort=require('normalize-port');

require('dotenv').config();
//routes
var indexRoute = require("./routes/index"),
    blogRoute = require("./routes/blog"),
    portfolioRoute = require("./routes/portfolio");
    


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(flash());
//require moment
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000 //1 hour
    }
}));

app.use(function(req, res, next){
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/",indexRoute);
app.use("/blog",blogRoute);
app.use("/portfolio",portfolioRoute);

var port = normalizePort(process.env.PORT || '3000');

var server = require('http').Server(app);

server.listen(port,function(){
  console.log("Sever Onling Port: "+port)
});

