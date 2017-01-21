var mongoose = require ('mongoose');

var RecetteSchema = new mongoose.Schema({
	nomr:String,
	upvotes: {type: Number, default: 0},
	tempsdecuisson: Number,
	tempsdepreparation: Number,
	insctructions: String,
	lien: String,
	ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],	
	//picture: {type: Schema.Types.Mixed, required: true},
	author: String,
});

RecetteSchema.methods.upvote = function(cb) {
	this.upvotes +=1;
	this.save(cb);
};

mongoose.model('Recette', RecetteSchema);