var mongoose = require ('mongoose');

var PlanningSchema = new mongoose.Schema({
	jours:[],
	listedecourses: [],
	author: String,
});

mongoose.model('Planning', PlanningSchema);