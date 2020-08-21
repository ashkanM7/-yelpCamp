const express 	 	= require("express"),
	  app     	 	= express(),
	  bodyParser	= require("body-parser"),
	  mongoose	 	= require("mongoose"),
	  passport		= require("passport"),
	  localStrategy = require("passport-local"),
	  methodOverride= require("method-override"), 	
	  Campground    = require("./models/campground"),
	  Comment 		= require("./models/comment"),
	  User 			= require("./models/user"),
	  seedDB 		= require("./seeds");

//Requiring ROUTES
var 	campgroundRouters = require("./routes/campgrounds"),
		commentRouters	 = require("./routes/comments"),
		indexRouters		 = require("./routes/index");


//Connect mongoose to mongo DB
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
	
app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); //seed the DB

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Noushin is the best",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	next();
})


app.use(indexRouters);
app.use("/campgrounds",campgroundRouters);
app.use("/campgrounds/:id/comments",commentRouters);

app.listen(3000, ()=>{
	console.log("The YelpCamp Server Has Started!!!")
})