var mongoose 		= require("mongoose"),
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment");

var data = [
	{
		name:"Nature",
		image:"https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	},
	{
		name:"Clouds Rest",
		image:"https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	},
	{
		name:"Auroura night",
		image:"https://images.unsplash.com/photo-1539183204366-63a0589187ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	}

]

	//FIRST THING IS TO REMOVE EVERYTHING IN CAMPGROUND
function seedDB(){
	//Remove all campgrounds
	Campground.remove({},(err)=>{
		if(err){
			console.log(err)
		}else{
			console.log("REMOVED ALL CAMPGROUNDS!!")	
			data.forEach((seed)=>{
		Campground.create(seed,(err, campground)=>{
			if(err){
				console.log(err)
			}else{
				console.log("CREATED A NEW CAMPGROUND");
				//create a commnet
				Comment.create({
					title:"This place is greate, but I wish there was internet",
					author:"Homer"
				},(err, comment)=>{
					if(err){
						console.log(err)
					}else{
						campground.comments.push(comment);
						campground.save();
						console.log("CREATED A NEW COMMNET")
					}
				})
			}
		})
	 })
		}
		
	})
};

	//create a few camprounds
	
	


module.exports = seedDB;
	


