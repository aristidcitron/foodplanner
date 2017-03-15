var mongoose = require ('mongoose');

var IngredientsdispoSchema = new mongoose.Schema({
	nomid:String,
	rayon: String,
	unite: String,
	type: String,
	glucide: Number,
	lipide: Number,
	protide: Number,
	calories: Number, 
	prix: Number,
	poidmoyen:{type: Number, default: 1},
});

mongoose.model('Ingredientsdispo', IngredientsdispoSchema);