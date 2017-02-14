var mongoose = require ('mongoose');

var IngredientsdispoSchema = new mongoose.Schema({
	nomid:String,
	rayon: String,
	unite: String,
	type: String, 
	apport: String, 
	poidmoyen:String,
});

mongoose.model('Ingredientsdispo', IngredientsdispoSchema);