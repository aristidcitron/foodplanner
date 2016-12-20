var mongoose = require ('mongoose');

var RecetteSchema = new mongoose.Schema({
	nom:String,
	upvotes: {type: Number, default: 0},
	tempsdecuisson: Number,
	tempsdepreparation: Number,
	insctructions: String,
	lien: String,
	ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}]	
});

mongoose.model('Recette', RecetteSchema);