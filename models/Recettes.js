var mongoose = require ('mongoose');

var RecetteSchema = new mongoose.Schema({
	nomr:String,
	upvotes: {type: Number, default: 0},
	tempsdecuisson: Number,
	tempsdepreparation: Number,
	instructions: String,
	lien: String,
	ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],	
	picture: {type: mongoose.Schema.Types.Mixed, required: false},
	author: String,
	portionmini: {type: Number, default: 1},
});

RecetteSchema.methods.upvote = function(cb) {
	this.upvotes +=1;
	this.save(cb);
};

module.exports = mongoose.model('Recette', RecetteSchema);

//