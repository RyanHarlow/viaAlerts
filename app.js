const axios = require('axios');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
var nodemailer = require('nodemailer');

const url = "https://www.viainfo.net/service-alerts/";


var rule = new schedule.RecurrenceRule();
rule.hour = 6;

var j = schedule.scheduleJob(rule, function(){
	getData();
})


const getData = () =>{
	axios.get(url)
	.then(respose => {
		 parseData(respose.data);
	})
	.catch(error => {
		console.log(error);
	})	
}



const parseData = (data) => {
	const $ = cheerio.load(data);

	var detours = $('.Post-panel').text();
	

	var detourOn96 = false;
	var detourOn603 = false;
	if(detours.indexOf('route 96') > 0){
		detourOn96 = true;
	}if(detours.indexOf('Route 96') > 0){
		detourOn96 = true;
	}if(detours.indexOf('route 603') > 0){
		detourOn603 = true;
	}if(detours.indexOf('Route 603') > 0){
		detourOn603 = true;
	}

	if(detourOn96 || detourOn603){
		sendEmail(detourOn96, detourOn603);
	}
}


const sendEmail = (detourOn96, detourOn603) => {

	var message = "";
	if(detourOn603 && detourOn96){
		message = "There is an Alert for route 603 and 96 please see https://www.viainfo.net/service-alerts/"
	}else if(detourOn96){
		message = "There is an Alert for route 96 please see https://www.viainfo.net/service-alerts/"
	}else if(detourOn603){
		message = "There is an Alert for route 603 please see https://www.viainfo.net/service-alerts/"
	}

		var transporter = nodemailer.createTransport({
		 service: 'gmail',
		 auth: {
		        user: '', //sender address
		        pass: ''			//sender password
		    }
		});

		const mailOptions = {
		  from: '', // sender address
		  to: '', // list of receivers
		  subject: 'Via Alert', // Subject line
		  html: message// plain text body
		};


		transporter.sendMail(mailOptions, function (err, info) {
		   if(err)
		     console.log(err)
		   else
		     console.log(info);
		});
}
