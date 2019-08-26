var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	moviecart: [
		{
			Title: String,
			Poster: String,
			Year: String,
			Released: String, 
			Rated: String,
			Runtime: String,
			Director: String,
			Genre: String,
			Actors: String,
			Plot: String,
			Metascore: String,
			imdbRating: String,
			imdbID: String,
			comment: String,
			review: String,
			seen: String,
			Type: String
		}
	],
	seriescart: [
		{
			Title: String,
			Poster: String,
			Year: String,
			Released: String, 
			Rated: String,
			Runtime: String,
			Director: String,
			Genre: String,
			Actors: String,
			Plot: String,
			Metascore: String,
			imdbRating: String,
			imdbID: String,
			comment: String,
			review: String,
			seen: String,
			Type: String,
			totalSeasons: String
		}
	]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);