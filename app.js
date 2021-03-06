var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require ('mongoose');
var passport = require ('passport');

// PHOTO
var morgan = require('morgan');
var bodyParser = require('body-parser');


//var superhero = require('./app/routes/superhero')(); => Pas besoin






mongoose.connect ('mongodb://toto:28021986@ec2-54-235-42-48.compute-1.amazonaws.com:27017/dummyDB');

require('./models/Recettes.js');
require('./models/Plannings.js');
require('./models/Ingredients.js');
require('./models/Ingredientsdispos.js');
require('./models/Users.js');
require('./config/passport.js');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');










// PHOTO

// Log with Morgan PHOTO
app.use(morgan('dev'));


// parse application/json and look for raw text                                   
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

// Static files
app.use(express.static(__dirname + '/public')); 
















// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());





// PHOTO
//app.route('/recette')
  //  .post(recette.post)
    //.get(recette.getAll);
//app.route('/recette/:id')
  //  .get(recette.getOne);
//app.listen(port);
//console.log('listening on port ' + port);



app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
