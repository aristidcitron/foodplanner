var mongoose = require ('mongoose');

var PlanningsSchema = new mongoose.Schema({
	idrecette1: String,
	nombrepersonne1: Number,
	idrecette2: String,
	nombrepersonne2: Number,
	idrecette3: String,
	nombrepersonne3: Number,
	idrecette4: String,
	nombrepersonne4: Number,		
	idrecette5: String,
	nombrepersonne5: Number,
	idrecette6: String,
	nombrepersonne6: Number,
	idrecette7: String,
	nombrepersonne7: Number,
	idrecette8: String,
	nombrepersonne8: Number,	
	idrecette9: String,
	nombrepersonne9: Number,
	idrecette10: String,
	nombrepersonne10: Number,
	idrecette11: String,
	nombrepersonne11: Number,
	idrecette12: String,
	nombrepersonne12: Number,	
	idrecette13: String,
	nombrepersonne13: Number,
	idrecette14: String,
	nombrepersonne14: Number,					
});

mongoose.model('planning', PlanningsSchema);