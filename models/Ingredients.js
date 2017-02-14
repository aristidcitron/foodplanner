var mongoose = require ('mongoose');

var IngredientSchema = new mongoose.Schema({
	nomi:String,
	nombre: Number,
	idingredientdispo: String,
	rayon: String,
	unite: String,
	recette: {type: mongoose.Schema.Types.ObjectId, ref:'Recette'},
	type: String, 
	apport: String, 
	poidmoyen: String,
});

mongoose.model('Ingredient', IngredientSchema);