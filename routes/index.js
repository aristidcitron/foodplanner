var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Recette = mongoose.model('Recette');
var Ingredient = mongoose.model('Ingredient');

//avoir la liste des recettes
router.get('/recettes', function (req,res,next){
	Recette.find(function(err, recettes){
		if (err) {next(err);}
		res.json(recettes);
	})
});

//ajouter une recette
router.post('/recettes/', function (req,res,next){
	var recette = new Recette(req.body);
	recette.save(function(err, recette){
		if (err) { return next (err);}
		res.json(recette);
	})
});	

//récupérer l'id de recette en paramètre pour ajouter dans un url
router.param('recette', function(req,res,next,id){
	var query = Recette.findById(id);
	query.exec(function(err, recette){
		if (err) {return next(err);}
		if (!recette) {return next(new Error("je ne trouve pas cette recette :("));}
		req.recette = recette;
	return next();
	})
});

//avoir les infos d'une recette
router.get('/recettes/:recette', function (req, res) {
	req.recette.populate('ingredients', function(err,post){
		res.json(req.recette);
	});		
});
// ajouter un like
router.put('/recettes/:recette/upvote', function(req,res,next){
	req.recette.upvote(function(err,recette){
		if (err) {return next(err);}
		res.json(recette);
	});
});

//ajouter un ingredient
router.post('/recettes/:recette/ingredients', function(req,res,next){
	var ingredient = new Ingredient(req.body);
	ingredient.recette = req.recette;
	ingredient.save(function(err,comment){
		if(err) {return next(err);}
		req.recette.ingredients.push(ingredient);
		req.recette.save(function(err,recette){
			if(err) {return next(err);}
			res.json(recette);
		});
	});
});


module.exports = router;
