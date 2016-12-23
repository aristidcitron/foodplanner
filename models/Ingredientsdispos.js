var mongoose = require ('mongoose');

var IngredientsdispoSchema = new mongoose.Schema({
	nomid:String,
	rayon: String,
	unite: String,
});

mongoose.model('Ingredientsdispo', IngredientsdispoSchema);