var mongoose = require ('mongoose');

var PlanningSchema = new mongoose.Schema({
	listedecourses: [],
	jours:[],
	author: String,
	date: { type: Date, default: Date.now },
});

mongoose.model('Planning', PlanningSchema);