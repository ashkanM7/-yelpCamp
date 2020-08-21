let express    = require("express"),
	router	   = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment");
//Comments NEW
router.get("/new", isLoggedIn, (req,res)=>{
	Campground.findById(req.params.id,(err, foundCampground)=>{
		if(err){
			console.log(err)
		}else{
			res.render("comments/new",{campground: foundCampground})
		}
	})
	
})

//Comments CREATE
router.post("/", isLoggedIn, (req, res)=>{
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
					//add username and id to comment
					comment.author.id = req.user.id;
					comment.author.username = req.user.username;
		
					//save comment
					comment.save();

					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					res.redirect("/campgrounds/"+ campground._id)
				}
			})
		}
	}) 
})

//EDIT ROUTE
router.get("/:comment_id/edit",checkCommentOwnership,(req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{ 
		if(err){
			res.redirect("back")
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	})
	
})

//UPDATE ROUTE FOR COMMENT
router.put("/:comment_id",checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+ req.params.id)
		}
	})
	
})

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",checkCommentOwnership, (req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+ req.params.id)
		}
	})
})
//middeware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

function checkCommentOwnership(req, res, next){
	//is logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if(err){
				res.redirect("back")
			}else{
				//does own the campground
				if(foundComment.author.id.equals(req.user._id)){
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


module. exports = router;