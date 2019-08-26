//App Configuration
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var unirest = require("unirest");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

mongoose.connect("mongodb://localhost:27017/moviestore", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
	secret: "This is my first Web App",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pass the User info 
app.use(function(request, response, next){
	response.locals.currentUser = request.user;
	response.locals.error = request.flash("error");
	response.locals.success = request.flash("success");
	next();
});

//Routes
app.get("/", function(request, response){
	response.render("Landing");
});

app.get("/search", function(request, response){
	response.render("search");
});

app.get("/search/results", function(request, response){
	//3296cf037emsh5be0dd84dc48b54p1e1eb6jsn1f4c4b75fc7f <-------- my api key
	var req = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");
	req.headers({
		"x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
		"x-rapidapi-key": "3296cf037emsh5be0dd84dc48b54p1e1eb6jsn1f4c4b75fc7f"
	});
	
	var myObj = {
		"page": "1",
		"r": "json"
	};
	myObj.s = request.query.searchobj.String;

	if(request.query.searchobj.Year){
		myObj.y=request.query.searchobj.Year;
	}
	myObj.type=request.query.searchobj.Type;

	req.query(myObj);
	req.end(function (res) {
		/*if (res.error) throw new Error(res.error);
		response.render("results", {movies: res.body});*/
		if (res.error){
			response.render("results", {movies: {}});
		}
		else {
			response.render("results", {movies: res.body});
		}
	}); 

});

app.get("/details/:imdbID", function(request, response){
	var req = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");

	req.query({
		"i": request.params.imdbID,
		"r": "json"
	});

	req.headers({
		"x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
		"x-rapidapi-key": "3296cf037emsh5be0dd84dc48b54p1e1eb6jsn1f4c4b75fc7f"
	});


	req.end(function (res) {
		/*if (res.error) throw new Error(res.error);
		response.render("details", {movie: res.body});*/
		if (res.error){
			response.render("details", {movie: {}});
		} else{
			response.render("details", {movie: res.body});
		}
	});
});

app.get("/home", isLoggedIn, function(request, response){
	response.render("home");
});

app.get("/about", function(request, response){
	response.render("about");
});

app.post("/add/:imdbID", isLoggedIn, function(request, response){
	//response.send(request.body);
	//console.log(request.user);
	var req = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");

	req.query({
		"i": request.params.imdbID,
		"r": "json"
	});

	req.headers({
		"x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
		"x-rapidapi-key": "3296cf037emsh5be0dd84dc48b54p1e1eb6jsn1f4c4b75fc7f"
	});


	req.end(function (res) {
		/*if (res.error) throw new Error(res.error);
		response.render("details", {movie: res.body});*/
		if (res.error){
			response.redirect("/home");
		} else{
			//console.log(res.body);
			var saveObj = {
				"Title" : res.body.Title,
				"Poster" : res.body.Poster,
				"Year" : res.body.Year,
				"Released" : res.body.Released,
				"Rated" : res.body.Rated,
				"Runtime" : res.body.Runtime,
				"Director" : res.body.Director,
				"Genre" : res.body.Genre,
				"Actors" : res.body.Actors,
				"Plot" : res.body.Plot,
				"Metascore" : res.body.Metascore,
				"imdbRating" : res.body.imdbRating,
				"imdbID" : res.body.imdbID,
				"comment" : request.body.comment,
				"review" : "",
				"seen" : "Yet to See",
				"Type" : res.body.Type
			};
			if(res.body.Type === "movie"){
				request.user.moviecart.push(saveObj);
			} else {
				saveObj.totalSeasons = res.body.totalSeasons;
				request.user.seriescart.push(saveObj);
			}
			request.user.save();
			request.flash("success", saveObj.Title + " has been added to your cart!");
			response.redirect("/home");
		}
	});
});

app.delete("/details/:id/:Type", isLoggedIn, function(request, response){
	var type = request.params.Type;
	
	var ind=0;
	var cnt=0;
	if(type=="movie"){
		request.user.moviecart.forEach(function (cartobj){
			if(cartobj._id.equals(request.params.id)){
				ind=cnt;
			}
			cnt++;
		});
		request.user.moviecart.splice(ind,1);
		request.user.save();
	} else {
		request.user.seriescart.forEach(function (cartobj){
			if(cartobj._id.equals(request.params.id)){
				ind=cnt;
			}
			cnt++;
		});
		request.user.seriescart.splice(ind,1);
		request.user.save();
	}
	request.flash("success", "You removed a " + request.params.Type);
	response.redirect("/home");
});

app.put("/details/:id/:Type", isLoggedIn, function(request, response){
	var type = request.params.Type;
	
	var ind=0;
	var cnt=0;
	if(type=="movie"){
		request.user.moviecart.forEach(function (cartobj){
			if(cartobj._id.equals(request.params.id)){
				ind=cnt;
			}
			cnt++;
		});
		request.user.moviecart[ind].seen=request.body.togglevals.seen;
		request.user.moviecart[ind].review=request.body.togglevals.review;
		request.user.save();
	} else {
		request.user.seriescart.forEach(function (cartobj){
			if(cartobj._id.equals(request.params.id)){
				ind=cnt;
			}
			cnt++;
		});
		request.user.seriescart[ind].seen=request.body.togglevals.seen;
		request.user.seriescart[ind].review=request.body.togglevals.review;
		request.user.save();
	}
	request.flash("success", "Watch Status changed!");
	response.redirect("/home");
});

//Authentication Routes
app.get("/register", function(request, response){
	response.render("register");
});

app.post("/register", correctPass, function(request, response){
	var newUser = new User({name: request.body.name, username: request.body.username});
	User.register(newUser, request.body.password, function(err, user){
		if(err){
			request.flash("error", "That Username isn't available!");
			response.redirect("/register");
		} else {
			passport.authenticate("local")(request, response, function(){
				request.flash("success", request.body.name + ", you've been registered successfully!");
				response.redirect("/home");
			});
		}
	});
});

app.get("/login", function(request, response){
	response.render("login");
});

app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/home",
		failureRedirect: "/login"
	}), function(request, response){
});

app.get("/logout", function(request, response){
	request.logout();
	request.flash("success", "Logged you out!");
	response.redirect("/");
});

//temporary middleware
function isLoggedIn(request, response, next){
	if(request.isAuthenticated()){
		next();
	} else {
		request.flash("error", "Please Login First!");
		response.redirect("/login");
	}
}

function correctPass(request, response, next){
	if(request.body.password==request.body.password2){
		next();
	} else {
		request.flash("error", "The passwords didn't match!");
		response.redirect("/register");
	}
}

app.listen(3000, function(){
	console.log("Now serving MovieStore App on Port 3000...");
});