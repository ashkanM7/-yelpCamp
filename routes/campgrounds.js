var express = require("express"),
	router  = express.Router({mergeParams:true});

var Campground = require("../models/campground");

//INDEX ROUTE- show all campgrounds
router.get("/",(req,res)=>{
	//GET ALL CAMPGROUNDS FROM DB
	Campground.find({},(err,allCampgrounds)=>{
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user})
		}
	})
	
})

//CREATE ROUTE- add new capmground to DB
router.post("/",isLoggedIn,(req, res)=>{
	
	// get data from form and add to compgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
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
//NEW ROUTE- show form to create campground
router.get("/new",isLoggedIn,(req,res)=>{
	res.render("campgrounds/new.ejs")
})

//SHOW ROUTE
router.get("/:id", (req, res)=>{
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

//EDIT ROUTE
router.get("/:id/edit",checkCampgroundOwnership, (req,res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		res.render("campgrounds/edit", {campground: foundCampground})
	})			
})
//UPDATE ROUTE
router.put("/:id",checkCampgroundOwnership, (req, res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds")
		}else{
		//redirect somewhere(show page)
				res.redirect("/campgrounds/"+req.params.id)
		}
		
	})
	
})

//DESTROY ROUTE
router.delete("/:id",checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds")
		}
	})
})

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

function checkCampgroundOwnership(req, res, next){
	//is logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground)=>{
			if(err){
				res.redirect("back")
			}else{
				//does own the campground
				if(foundCampground.author.id.equals(req.user._id)){
					next()
				}else{
					res.redirect("back")
				}		
			}
		})
	}else{
		//else => redirect
	//else=> redirect
		res.redirect("back")
	}		
}

module.exports = router;