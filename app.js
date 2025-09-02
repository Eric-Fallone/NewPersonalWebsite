var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    normalizePort=require('normalize-port');

require('dotenv').config();

//routes
var indexRoute = require("./routes/Index"),
    blogRoute = require("./routes/Blog"),
    portfolioRoute = require("./routes/Portfolio"),
    sillyThings = require("./routes/SillyThings");
    


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//require moment
app.locals.moment = require('moment');

app.use("/",indexRoute);
app.use("/Blog",blogRoute);
app.use("/Portfolio",portfolioRoute);
app.use("/SillyThings",sillyThings);

var port = normalizePort(process.env.PORT || '3000');

var server = require('http').Server(app);

server.listen(port,function(){
  console.log("Sever Onling Port: "+port)
});

