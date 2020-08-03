const express 	 	= require("express"),
	  app     	 	= express(),
	  bodyParser	= require("body-parser"),
	  mongoose	 	= require("mongoose"),
	  passport		= require("passport"),
	  localStrategy = require("passport-local"),
	  Campground    = require("./models/campground"),
	  Comment 		= require("./models/comment"),
	  User 			= require("./models/user"),
	  seedDB 		= require("./seeds");


//Connect mongoose to mongo DB
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
	
app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));
seedDB();

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



app.get("/",(req,res)=>{
	res.render("landing")
})

//INDEX - show all campgrounds
app.get("/campgrounds",(req,res)=>{
	//GET ALL CAMPGROUNDS FROM DB
	Campground.find({},(err,allCampgrounds)=>{
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user})
		}
	})
	
})

//CREATE - add new capmground to DB
app.post("/campgrounds",(req, res)=>{
	
	// get data from form and add to compgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	//	create a new campground and save to DB
	Campground.create(newCampground,(err,newlyCreated)=>{
		if(err){
			console.log(err)
		}else{
			// redirect back to compgrounds page
			res.redirect("/campgrounds")
		}
	})
	
})
//NEW - show form to create campground
app.get("/campgrounds/new",(req,res)=>{
	res.render("campgrounds/new.ejs")
})
//SHOW
app.get("/campgrounds/:id", (req, res)=>{
	//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err){
			console.log(err)
		}else{
			console.log(foundCampground);
			//render show templatewith that campground
			res.render("campgrounds/show.ejs",{campground: foundCampground})	
		}
	})
	
})

//================================
//COMMENTS ROUTE
//================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res)=>{
	Campground.findById(req.params.id,(err, foundCampground)=>{
		if(err){
			console.log(err)
		}else{
			res.render("comments/new",{campground: foundCampground})
		}
	})
	
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res)=>{
	//look up campground using id
	Campground.findById(req.params.id , (err , campground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			//create new comment
			Comment.create(req.body.comment , (err, comment)=>{
				if(err){
					console.log(err)
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+ campground._id)
				}
			})
		}
	})
	//create new comment
	//connect new comment to campground
	//redirect campground to show page 
})

//=====================
//AUTH ROUTES
//=====================

app.get("/register",(req,res)=>{
	res.render("register")	
})

//handle sign up logic
app.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			res.redirect("/register")
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/campgrounds")
		})
	});
})

//show login form
app.get("/login", (req, res)=>{
	res.render("login")
})

//handling login logic

app.post("/login", passport.authenticate("local",
		{
			successRedirect:"/campgrounds",
			failureRedirect:"/login"	
		}	
	),(req, res)=>{
})

//logout route
app.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}
app.listen(3000, ()=>{
	console.log("The YelpCamp Server Has Started!!!")
})