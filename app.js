const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

var campgrounds = [
		{name:" Pin D'Erable - 161 Chemin du Lac Bertrand", image:"https://i36.photobucket.com/albums/e7/romaniukcol/1_zpslyngkvc8.jpg"},
		{name:"Oka National Park - 2020 Chemin d’Oka", image:"https://i36.photobucket.com/albums/e7/romaniukcol/2_zpshsczr0kt.jpg"},
		{name:"Morin Heights Nature Camping - 185 Rue Bennett ", image:"https://i36.photobucket.com/albums/e7/romaniukcol/3_zps00o8pduh.jpg"},
		{name:"Camping Laurentien - 1949 Rue Guertin ", image:"https://i36.photobucket.com/albums/e7/romaniukcol/4_zpsqmu4bgb3.jpg"},
		{name:"Fou Du Roi - 1720 Rue Landry ", image:"https://i36.photobucket.com/albums/e7/romaniukcol/5_zpsbybignt1.jpg"},
		{name:"Mont-Orford National Park - 3321 Chemin du Parc ", image:"https://i36.photobucket.com/albums/e7/romaniukcol/6_zpsz7uyrqum.jpg"}
	]

app.get("/",(req,res)=>{
	res.render("landing")
})

app.get("/campgrounds",(req,res)=>{
	
	res.render("campgrounds", {campgrounds:campgrounds})
})

app.post("/campgrounds",(req, res)=>{
	
	// get data from form and add to compgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	// redirect back to compgrounds page
	res.redirect("/campgrounds")
})

app.get("/campgrounds/new",(req,res)=>{
	res.render("new.ejs")
})

app.listen(3000, ()=>{
	console.log("The YelpCamp Server Has Started!!!")
})