
router.post('/pushevent/', auth, function (req,res,next){
// setup email data with unicode symbols
var test = req.body;
user = req.payload.username;
console.log(user);
console.log(test);
"use strcit";
let mails = [];

User.find({username:user},function(err,user){
		var back = {};
		back.email	= user[0].email;
		console.log(back);
		

for (i=0; i<test.length; i++){ 
// préparr icall
if (test[i].midi!=''){ console.log(test[i].date);
var d= new Date(test[i].date);
	var event = cal.addEvent({
	    start: d,
	    end: d,
	    title : 'Déjeuné',
	    description : 'A vous de jouer, chef! pour ce midi il faut cuisiner '+test[i].midi.nomr + ' pour ' +test[i].nbpersmidi +' personnes',
	    summary: 'Mon repas',
	    sequence: 0,
	    method: 'request',
	    organiser: 'Ondinequoi.com <contact@ondinequoi.com>'
	})
	cal = cal.toString(); 
console.log('coucou');
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

mails.push(mailOptions);

};
if (test[i].soir!=''){
	var event = cal.addEvent({
	    start: d,
	    end: d,
	    title : 'Diner',
	    description : 'A vous de jouer, chef! pour ce soir il faut cuisiner '+test[i].soir.nomr + ' pour ' +test[i].nbperssoir + ' personnes',
	    summary: 'Mon repas',
	    sequence: 0,
	    method: 'request',
	    organiser: 'Ondinequoi.com <contact@ondinequoi.com>'
	});
	cal = cal.toString(); 

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
mails.push(mailOptions);

}

}
});





      	async.each(mails,
      		function (mail,callback){
      			transporter.sendMail(mail, (error, info) => {
			    if (error) {
			        return console.log(error);
			    }
			    console.log('Message %s sent: %s', info.messageId, info.response);
			    callback();
			});

      		},
      		function(err){

         		res.json('end');  			
      		}
      	)	


});



