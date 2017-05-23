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
var Planning = mongoose.model('Planning');
var Ingredientsdispo = mongoose.model('Ingredientsdispo');
var passport = require('passport');
var User = mongoose.model('User');
var jinqJs = require('jinq');
var async = require('async');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
						user: "ondinequoi@gmail.com",
						pass: "LP3CvammG"
    }
});


//ical event
var ical = require('ical-generator'),
    http = require('http'),
    cal = ical({domain: 'ondinequoi.com', name: 'My iCal invite', timezone: 'Europe/Berlin'});





router.post('/pushevent/', auth, function (req,res,next){
// setup email data with unicode symbols
var test = req.body;
user = req.payload.username;


User.find({username:user},function(err,user){
		var back = {};
		back.email	= user[0].email;


for (i=0; i<test.length; i++){ 
// préparr icall


if (test[i].midi!=''){ 
var d= new Date(test[i].date);
var f=new Date(test[i].date); 
d.setHours(11, 00, 00, 00);
f.setHours(13, 00, 00, 00);
console.log(d);console.log(f);

cal = ical({
	domain: 'ondinequoi.com', name: 'My iCal invite', timezone: 'Europe/Berlin',
    events: [
        {
			start: d,
		    end: f,
		    title : 'Déjeuné',
		    description : 'A vous de jouer, chef! pour ce midi il faut cuisiner '+test[i].midi.nomr + ' pour ' +test[i].nbpersmidi +' personnes',
		    summary: 'Mon repas',
		    sequence: 0,
		    method: 'request',
		    organiser: 'Ondinequoi.com <contact@ondinequoi.com>'
        }
    ]
}).toString();



// preparer mail
let mailOptions = {
    from: '"On dine quoi?" <ondinequoi@gmail.com>', // sender address
    to: back.email, // list of receivers
    subject: "repas du midi", // Subject line
        icalEvent: {
        filename: 'invitation.ics',
        method: 'request',
        content: cal
    }
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
};
if (test[i].soir!=''){
var d= new Date(test[i].date);
var f=new Date(test[i].date); 
d.setHours(18, 00, 00, 00);
f.setHours(20, 00, 00, 00);
console.log(d);console.log(f);

cal = ical({
	domain: 'ondinequoi.com', name: 'My iCal invite', timezone: 'Europe/Berlin',
    events: [
        {
			start: d,
		    end: f,
		    title : 'Diner',
		    description : 'A vous de jouer, chef! pour ce soir il faut cuisiner '+test[i].soir.nomr + ' pour ' +test[i].nbperssoir + ' personnes',
		    summary: 'Mon repas',
		    sequence: 0,
		    method: 'request',
		    organiser: 'Ondinequoi.com <contact@ondinequoi.com>'
        }
    ]
}).toString();



// preparer mail
let mailOptions = {
    from: '"On dine quoi?" <ondinequoi@gmail.com>', // sender address
    to: back.email, // list of receivers
    subject: "repas du soir", // Subject line
        icalEvent: {
        filename: 'invitation.ics',
        method: 'request',
        content: cal
    }
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

}

}
});
});





















router.post('/pushmail/', function (req,res,next){
// setup email data with unicode symbols
var test = req.body;
console.log(test);

let mailOptions = {
    from: '"On dine quoi?" <ondinequoi@gmail.com>', // sender address
    to: 'aymeric.thas-pinot@hotmail.com', // list of receivers
    subject: test.objet, // Subject line
    html: '<b> envoyé de: </b>' + test.mail + '<br><b> contenu: </b>' +test.contenu// html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
});











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
    	{author:"Aymeric"},
      	{author:req.params.user},  	
    	{author: {$exists: false}}]
    	}, function(err, recettes){
			if (err) {next(err);}
			res.json(recettes);
		});
});


//getuserinfo
router.get('/user/:user', function (req,res,next){

	if (req.params.user === 'undefined'){res.json("coucou")}else{
	User.find({username:req.params.user},function(err,user){
		var back = {};
		back.user = user[0].username;
		back.email	= user[0].email;
		res.json(back);

	});}


		
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
	Recette.find({$or:[
    	{author:"Aymeric"},
      	{author:req.params.user},  	
    	{author: {$exists: false}}]
    	}, function(err, recettes){
			if (err) {next(err);}
			var recette = recettes[Math.floor(Math.random()*recettes.length)]
			res.json(recette);
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

   				ingredients = ingredients.concat([{id:docs[0].ingredients[i]._id,nombre:docs[0].ingredients[i].nombre,nbpers:item.nbpers,portionmini:docs[0].portionmini}]) 	
   				}
    	  callback();
    	});
      },  
      function (err) {
      	async.each(ingredients,
      		function (ingredient,callback){

      		  Ingredientsdispo.find({_id:ingredient.id}, function (err, docs) { 
      		  	  "use strict";
			      var ingredientscomplet= JSON.stringify(docs[0]);
			      ingredientscomplet= JSON.parse(ingredientscomplet);

		          var toto= Math.ceil(ingredient.nbpers/ingredient.portionmini)*ingredient.nombre;
		          ingredientscomplet.nombre = toto;
		          console.log(ingredientscomplet);
		          console.log(toto);console.log(ingredientscomplet.poidmoyen);console.log(ingredientscomplet.prix);
		          ingredientscomplet.prixtemp = toto*ingredientscomplet.poidmoyen/100*ingredientscomplet.prix;


		          result.push(ingredientscomplet); 
		          callback();
		        });
      		},
      		function(err){
      			var balance = new Object();
      			balance.liste = new jinqJs().from(result).groupBy('nomid', 'unite', 'rayon').sum('nombre').select();
         		balance.total=new jinqJs().from(result).sum('prixtemp').select();
         		res.json(balance);  			
      		}
      	)	

      }
    );  
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


//récupérer l'id du planning en paramètre pour ajouter dans un url
router.param('planning', function(req,res,next,id){
	var query = Planning.findById(id);
	query.exec(function(err, planning){
		if (err) {return next(err);}
		if (!planning) {return next(new Error("je ne trouve pas ce planning :("));}
		req.planning = planning;
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




//LA LISTE DE COURSE
//Ajouter une liste de course 
router.put('/liste/',auth, function (req,res,next){
	"use strict";
	var liste = req.body;
	console.log (liste);
	
		User.update({username:req.payload.username},{
			     $set: {listedecourses: liste}},function (err,ingredient){
					if (err) {return next (err);}
					//il manque un truc pour aller chercher le ingredient mis à jour, et non pas celui qui existait avant
				res.json(liste);
	});
});		


//Get une liste de course 
router.get('/liste/',auth, function (req,res,next){
	"use strict";
		User.find({username:req.payload.username},function (err,docs){
					if (err) {return next (err);}
					//il manque un truc pour aller chercher le ingredient mis à jour, et non pas celui qui existait avant
				console.log(docs[0]);
				res.json(docs[0].listedecourses);
	});
});		








// LES RECETTES

//ajouter une recette
router.post('/recettes/',auth, function (req,res,next){
	"use strict";
	var recette = new Recette(req.body);
	console.log(recette);
	recette.author = req.payload.username;
	 let ingredients = [];
		  let data =[];
		  let items = recette.ingredients;
		  recette.glucide = 0;
		  recette.lipide = 0;
		  recette.protide = 0;
		  recette.calories = 0;	
		  recette.prix = 0;			  	  		  		  
	      async.each(items,
	       function(item, callback) { 
	      	Ingredientsdispo.find({_id:item._id}, function (err, docs) {
	      	 	"use strict";
	      	 	var toto = {};
	      	 	toto.nomid = docs[0].nomid;
	      	 	toto._id = docs[0]._id;
	      	 	toto.nombre = item.nombre;
	      	 	toto.rayon = docs[0].rayon;
	      	 	toto.unite = docs[0].unite;
	      	 	toto.poidmoyen = docs[0].poidmoyen;	  	      	 	
	      	 	toto.type = docs[0].type;
 	      	 	toto.glucide = docs[0].glucide;
	      	 	toto.lipide = docs[0].lipide;
 	      	 	toto.protide = docs[0].protide;
	      	 	toto.calories = docs[0].calories;
 	      	 	toto.prix = docs[0].prix;



	 	      	var tata = {};  			
	      	 	tata.glucide = toto.nombre*toto.poidmoyen/100* docs[0].glucide/recette.portionmini;
	      	 	tata.lipide = toto.nombre*toto.poidmoyen/100* docs[0].lipide/recette.portionmini;
	      	 	tata.protide = toto.nombre*toto.poidmoyen/100* docs[0].protide/recette.portionmini;
	      	 	tata.calories = toto.nombre*toto.poidmoyen/100* docs[0].calories/recette.portionmini;
    	 	 	tata.prix = toto.nombre*toto.poidmoyen/100* docs[0].prixtionmini;

	   			ingredients.push(toto);
	   			data.push(tata);

	    	  	callback(err);
	    	});
	       }, function (err) {
	       for (var i = 0; i<data.length; i++)
	       {
	       	recette.calories = Math.round(parseFloat(recette.calories)+parseFloat(data[i].calories));
	       	recette.protide = Math.round(parseFloat(recette.protide) + parseFloat(data[i].protide));
	       	recette.lipide = Math.round(parseFloat(recette.lipide) + parseFloat(data[i].lipide));
	       	recette.glucide = Math.round(parseFloat(recette.glucide) + parseFloat(data[i].glucide));	
	      	recette.prix = Math.round(parseFloat(recette.prix) + parseFloat(data[i].prix));	       	
	       };

	recette.save(function(err, recette){
		if (err) { return next (err);}
		res.json(recette);
	});})
});	



//editer une recette
router.put('/recettes/:recette', auth, function(req,res){
			"use strict";
	let recette = new Recette(req.body);
	if(recette.author != req.payload.username){
		 return res.status(400).json({message: 'Impossible de modifier des recettes crées par d autres utilisateurs, vos changements ne seront donc pas sauvegardés!'})	
	}{

		  let ingredients = [];
		  let data =[];
		  let items = recette.ingredients;
		  recette.glucide = 0;
		  recette.lipide = 0;
		  recette.protide = 0;
		  recette.calories = 0;	
		  recette.prix = 0;			  	  		  		  
	      async.each(items,
	       function(item, callback) { 
	      	Ingredientsdispo.find({_id:item._id}, function (err, docs) {
	      	 	"use strict";
	      	 	var toto = {};
	      	 	toto.nomid = docs[0].nomid;
	      	 	toto._id = docs[0]._id;
	      	 	toto.nombre = item.nombre;
	      	 	toto.rayon = docs[0].rayon;
	      	 	toto.unite = docs[0].unite;
	      	 	toto.poidmoyen = docs[0].poidmoyen;	  	      	 	
	      	 	toto.type = docs[0].type;
 	      	 	toto.glucide = docs[0].glucide;
	      	 	toto.lipide = docs[0].lipide;
 	      	 	toto.protide = docs[0].protide;
	      	 	toto.calories = docs[0].calories;
 	      	 	toto.prix = docs[0].prix;



	 	      	var tata = {};  			
	      	 	tata.glucide = toto.nombre*toto.poidmoyen/100* docs[0].glucide/recette.portionmini;
	      	 	tata.lipide = toto.nombre*toto.poidmoyen/100* docs[0].lipide/recette.portionmini;
	      	 	tata.protide = toto.nombre*toto.poidmoyen/100* docs[0].protide/recette.portionmini;
	      	 	tata.calories = toto.nombre*toto.poidmoyen/100* docs[0].calories/recette.portionmini;
    	 	 	tata.prix = toto.nombre*toto.poidmoyen/100* docs[0].prix/recette.portionmini;

	   			ingredients.push(toto);
	   			data.push(tata);

	    	  	callback(err);
	    	});
	       }, function (err) {
	       for (var i = 0; i<data.length; i++)
	       {
	       	recette.calories = Math.round(parseFloat(recette.calories)+ parseFloat(data[i].calories));
	       	recette.protide = Math.round(parseFloat(recette.protide) + parseFloat(data[i].protide));
	       	recette.lipide = Math.round(parseFloat(recette.lipide) + parseFloat(data[i].lipide));
	       	recette.glucide = Math.round(parseFloat(recette.glucide) + parseFloat(data[i].glucide));	
	      	recette.prix = Math.round(parseFloat(recette.prix) + parseFloat(data[i].prix));	       	
	       };
			       
	
		


		Recette.findOneAndUpdate({_id:req.params.recette}, recette, function (err,recette){
			if (err) {return next (err);}
			res.json(recette);
			   		}  
		 );		
		})
	}	 
});





//avoir les infos d'une recette
router.get('/recettes/:recette', function (req, res) {
	req.recette.populate('ingredients', function(err,recette){
		"use strict";
		  let ingredients = [];
		  let data =[];
		  let items = recette.ingredients;
		  recette.glucide = 0;
		  recette.lipide = 0;
		  recette.protide = 0;
		  recette.calories = 0;	
		  recette.prix = 0;			  	  		  		  
	      async.each(items,
	       function(item, callback) { 
	      	Ingredientsdispo.find({_id:item._id}, function (err, docs) {
	      	 	"use strict";
	      	 	var toto = {};
	      	 	toto.nomid = docs[0].nomid;
	      	 	toto._id = docs[0]._id;
	      	 	toto.nombre = item.nombre;
	      	 	toto.rayon = docs[0].rayon;
	      	 	toto.unite = docs[0].unite;
	      	 	toto.poidmoyen = docs[0].poidmoyen;	  	      	 	
	      	 	toto.type = docs[0].type;
 	      	 	toto.glucide = docs[0].glucide;
	      	 	toto.lipide = docs[0].lipide;
 	      	 	toto.protide = docs[0].protide;
	      	 	toto.calories = docs[0].calories;
 	      	 	toto.prix = docs[0].prix;



	 	      	var tata = {};  			
	      	 	tata.glucide = toto.nombre*toto.poidmoyen/100* docs[0].glucide/recette.portionmini;
	      	 	tata.lipide = toto.nombre*toto.poidmoyen/100* docs[0].lipide/recette.portionmini;
	      	 	tata.protide = toto.nombre*toto.poidmoyen/100* docs[0].protide/recette.portionmini;
	      	 	tata.calories = toto.nombre*toto.poidmoyen/100* docs[0].calories/recette.portionmini;
    	 	 	tata.prix = toto.nombre*toto.poidmoyen/100* docs[0].prix/recette.portionmini;

	   			ingredients.push(toto);
	   			data.push(tata);
	    	  	callback(err);
	    	});
	       }, function (err) {
	       recette.ingredients=ingredients;
	       for (var i = 0; i<data.length; i++)
	       {
	       	recette.calories = Math.round(parseFloat(recette.calories)+parseFloat(data[i].calories));
	       	recette.protide = Math.round(parseFloat(recette.protide) + parseFloat(data[i].protide));
	       	recette.lipide = Math.round(parseFloat(recette.lipide) + parseFloat(data[i].lipide));
	       	recette.glucide = Math.round(parseFloat(recette.glucide) + parseFloat(data[i].glucide));	
	      	recette.prix = Math.round(parseFloat(recette.prix) + parseFloat(data[i].prix));	       	
	       };
			console.log(recette)	   ;   	       
	       res.json(recette);
	   		}  
		 );		
	});
});




// supprimer une recette
router.delete('/recettes/:recette', auth, function(req,res){
	var coucou = req.recette;
	if(coucou.author === req.payload.username){
		return req.recette.remove(function(err,recette){
			if (err) {return next (err);}
			res.json(req.payload.username);
		});
	}res.status(400).json({message: 'Impossible de supprimer des recettes crées par d autres utilisateurs!'});

});





















// supprimer un ingredient dispo
router.delete('/ingredientsdispos/:ingredientsdispo', function(req,res){
	req.ingredientsdispo.remove(function(err,ingredientsdispo){
		if (err) {return next (err);}
		res.json(ingredientsdispo);
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

   // Ingredientsdispo.find({_id:ingredient.idingredientdispo}, function (err, docs) { console.log(docs)});


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










//ajouter un planning
router.post('/plannings/', auth, function (req,res,next){
	var planning = new Planning(req.body);
	planning.author = req.payload.username;
	planning.save(function(err, planning){
		if (err) { return next (err);}
		res.json(planning);
	});
});	

//avoir les planning d'un utilisateur
router.get('/mesplannings/:user', function (req,res,next){
	Planning.find({$or:[
     	{author:req.params.user}]
    	}, function(err, plannings){
			if (err) {next(err);}
			res.json(plannings);
		});
});

//avoir un planning d'utilisateur
router.get('/plannings/:planning', function (req, res) {

	Planning.find(
     	{_id:req.params.planning}, function(err, plannings){
			if (err) {next(err);}
			res.json(plannings); console.log(plannings)
		});

});







// supprimer un planning
router.delete('/plannings/:planning', function(req,res){
	req.planning.remove(function(err,planning){
		if (err) {return next (err);}
		res.json(planning);
	});
});







module.exports = router;



