var mongoose = require ('mongoose');

var RecetteSchema = new mongoose.Schema({
	nomr:String,
	upvotes: {type: Number, default: 0},
	tempsdecuisson: Number,
	tempsdepreparation: Number,
	instructions: String,
	lien: String,
	ingredients: Array,
	picture: {type: mongoose.Schema.Types.Mixed, required: false},
	author: String,
	glucide: Number,
	lipide: Number,
	protide: Number,
	calories: String, 
	prix: Number,
	portionmini: {type: Number, default: 1},
});

RecetteSchema.methods.upvote = function(cb) {
	this.upvotes +=1;
	this.save(cb);
};

module.exports = mongoose.model('Recette', RecetteSchema);

//