var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Recette = mongoose.model('Recette');
var Ingredient = mongoose.model('Ingredient');
var Ingredientsdispo = mongoose.model('Ingredientsdispo');
var passport = require('passport');
var User = mongoose.model('User');



router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});





router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});







//avoir la liste des recettes
router.get('/recettes', function (req,res,next){
	Recette.find(function(err, recettes){
		if (err) {next(err);}
		res.json(recettes);
	});
});

//ajouter une recette
router.post('/recettes/',auth, function (req,res,next){
	var recette = new Recette(req.body);
	recette.author = req.payload.username;
	recette.save(function(err, recette){
		if (err) { return next (err);}
		res.json(recette);
	});
});	

//récupérer l'id de recette en paramètre pour ajouter dans un url
router.param('recette', function(req,res,next,id){
	var query = Recette.findById(id);
	query.exec(function(err, recette){
		if (err) {return next(err);}
		if (!recette) {return next(new Error("je ne trouve pas cette recette :("));}
		req.recette = recette;
	return next();
	});
});

//récupérer l'id de l'ingredient en paramètre pour ajouter dans un url
router.param('ingredient', function(req,res,next,id){
	var query = Ingredient.findById(id);
	query.exec(function(err, ingredient){
		if (err) {return next(err);}
		if (!ingredient) {return next(new Error("je ne trouve pas cet ingredient :("));}
		req.ingredient = ingredient;
	return next();
	});
});



//récupérer l'id de ingredientsdispo en paramètre pour ajouter dans un url
router.param('ingredientsdispo', function(req,res,next,id){
	var query = Ingredientsdispo.findById(id);
	query.exec(function(err, ingredientsdispo){
		if (err) {return next(err);}
		if (!ingredientsdispo) {return next(new Error("je ne trouve pas cet ingredient dispo :("));}
		req.ingredientsdispo = ingredientsdispo;
	return next();
	});
});
//avoir les infos d'une recette
router.get('/recettes/:recette', function (req, res) {
	req.recette.populate('ingredients', function(err,recette){
		res.json(req.recette);
	});		
});

//avoir les infos d'une recette
router.get('/recettes2/:recette', function (req, res) {
	Recette.findById({_id:req.params.recette}, req.body, function(err,ingredients){
		res.json(req.ingredients);
	});		
});



// supprimer une recette
router.delete('/recettes/:recette', function(req,res){
	req.recette.remove(function(err,recette){
		if (err) {return next (err);}
		res.json(recette);
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
	ingredient.save(function(err,ingredient){
		if(err) {return next(err);}
		req.recette.ingredients.push(ingredient);
		req.recette.save(function(err,recette){
			if(err) {return next(err);}
			res.json(ingredient);
		});
	});
});

//ajouter un ingredient dispo
router.post('/ingredientsdispos/', function (req,res,next){
	var ingredientsdispo = new Ingredientsdispo(req.body);
	ingredientsdispo.save(function(err, ingredientsdispo){
		if (err) { return next (err);}
		res.json(ingredientsdispo);
	});
});	

//récupérer la liste des ingredients dispo
router.get('/ingredientsdispos/', function (req,res,next){
	Ingredientsdispo.find(function(err, ingredientsdispos){
		if (err) {next(err);}
		res.json(ingredientsdispos);
	});
});




// supprimer un ingredient dispo
router.delete('/ingredientsdispos/:ingredientsdispo', function(req,res){
	req.ingredientsdispo.remove(function(err,ingredientsdispo){
		if (err) {return next (err);}
		res.json(ingredientsdispo);
	});
});


// supprimer une recette
router.delete('/recettes/:recette', function(req,res){
	req.recette.remove(function(err,recette){
		if (err) {return next (err);}
		res.json(recette);
	});
});


//supprimer un ingredient d'une recette
router.delete('/recettes/:recette/ingredients/:ingredient', function(req,res){
	req.ingredient.remove(function(err,ingredient){
		if (err) {return next (err);}
		res.json(ingredient);
	});
});

//editer le nombre d'un ingredient
router.put('/ingredients/:ingredient', function(req,res){
		Ingredient.findOneAndUpdate({_id:req.params.ingredient}, req.body, function (err,ingredient){
		if (err) {return next (err);}
		//il manque un truc pour aller chercher le ingredient mis à jour, et non pas celui qui existait avant
		res.json(ingredient);
	});
});

module.exports = router;


