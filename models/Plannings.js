var mongoose = require ('mongoose');

var PlanningSchema = new mongoose.Schema({
	listedecourses: [],
	jours:[],
	author: String,
	nomp: String,
	date: { type: Date, default: Date.now },
});

mongoose.model('Planning', PlanningSchema);