var mongoose = require ('mongoose');

var IngredientSchema = new mongoose.Schema({
	nom:String,
	nombre: Number,
	rayon: String,
	unite: String,
	recette: {type: mongoose.Schema.Types.ObjectId, ref:'Recette'}
	
});

mongoose.model('Ingredient', IngredientSchema);