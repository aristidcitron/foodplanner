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
var jinqJs = require('jinq');
var async = require('async');



router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
	User.count({username: req.body.username}, function (err, count){ 
	    if(count>0){
	    	return res.status(400).json({message: 'le nom d utilisateur est déja utilisé'})
	    	}
	    	User.count({email: req.body.email}, function (err, count){ 
	    		if(count>0){
	    			return res.status(400).json({message: 'l email est deja pris'})
	    			}
		    	 {
		   	 	  var user = new User();
	 		      user.username = req.body.username;
	 		      user.email=req.body.email
		        //document exists });	
				  user.setPassword(req.body.password)
				  user.save(function (err){
				    if(err){ return next(err); }
				    return res.json({token: user.generateJWT()})
	 			 });
	        	}
	        }); 
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




router.get('/recettesuser/:user', function (req,res,next){
	Recette.find({$or:[
    	{author:"aymeric"},
      	{author:req.params.user},  	
    	{author: {$exists: false}}]
    	}, function(err, recettes){
			if (err) {next(err);}
			res.json(recettes);
		});
});



//avoir la liste des recettes
router.get('/recettes', function (req,res,next){
	Recette.find(function(err, recettes){
		if (err) {next(err);}
		res.json(recettes);
	});
});


//avoir une recette aléatoire
router.get('/recettealea', function (req,res,next){

	// Get the count of all users
	Recette.count().exec(function (err, count) {

	  // Get a random entry
	  var random = Math.floor(Math.random() * count)

	  // Again query all users but only fetch one offset by our random #
	  Recette.findOne().skip(random).exec(
	    function (err, result) {
	      // Tada! random user
	      res.json(result) 
	    })
	});
});




//avoir la liste des courses
router.post('/listedecourses', function (req,res,next){
"use strict";
  let items = req.body;
  let ingredients = [];
  let result = [];
      async.each(items,
       function(item, callback) { 
      	Recette.find({_id:item.idrecette}, function (err, docs) {
      	 "use strict";
   			for (var i=0; i<docs[0].ingredients.length; i++){
   				ingredients = ingredients.concat([{nom:docs[0].ingredients[i],nbpers:item.nbpers}]) 		
   				}
    	  callback();
    	});
      }, 
      function (err) {
      	async.each(ingredients,
      		function (ingredient,callback){
      		  Ingredient.find({_id:ingredient.nom}, function (err, docs) { 
      		  	  "use strict";
		          var ingredientscomplet = docs[0];
		          var toto= ingredient.nbpers*ingredientscomplet.nombre;
		          ingredientscomplet.nombre = toto;
		          result.push(ingredientscomplet);
		          callback();
		        });
      		},
      		function(err){
      			var balance = new jinqJs().from(result).groupBy('idingredientdispo', 'nomi', 'unite', 'rayon').sum('nombre').select();
         		console.log(balance); 
         		res.json(balance);  			
      		}
      	)	

      }
    );  
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
router.delete('/recettes/:recette', auth, function(req,res){
	var recette = new Recette(req.body);
	if(recette.author === req.payload.username){
		return req.recette.remove(function(err,recette){
			if (err) {return next (err);}
			res.json(req.payload.username);
		});
	}res.status(400).json({message: 'Impossible de supprimer des recettes crées par d autres utilisateurs!'});

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



//editer une recette
router.put('/recettes/:recette', auth, function(req,res){
	var recette = new Recette(req.body);		
	if(recette.author != req.payload.username){
		 return res.status(400).json({message: 'Impossible de modifier des recettes crées par d autres utilisateurs, vos changements ne seront donc pas sauvegardés!'})	
	}{
		Recette.findOneAndUpdate({_id:req.params.recette}, req.body, function (err,recette){
			if (err) {return next (err);}
			res.json(recette);
		})
	}	 
});


module.exports = router;



