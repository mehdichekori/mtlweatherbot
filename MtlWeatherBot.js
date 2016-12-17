var request = require('request');
var Twit = require('twit')
var config = require('./config');
var url = 'http://api.openweathermap.org/data/2.5/weather?q=Montreal&APPID=8b5d20a4d6441d9fab48bd8bda62ebc4&units=metric';

var T = new Twit(config);

GetTemp = function(){
  request({
    url:url,
    json: true,
  }, function (error,response,body){
    if(!error && response.statusCode === 200){
      console.log("The current weather in montreal is "+body.main.temp+"°C");
      TweetTemp(body.main.temp);
    }
    if(error){
      console.log("Errog Triggered in GetTemp function");
      console.log(error);
    }
  })
}

function TweetTemp(CurrentTemp){

  time = convertToServerTimeZone();

  var tweet = {
    status: 'Its '+ time +' and the temperature in montreal is ' + CurrentTemp + '°C'
  }

  T.post('statuses/update',tweet,tweeted); //add check if currenttemp has load

  function tweeted(err,data,response){
    if(err){
      console.log("Error Triggered in Tweeted Function");
      console.log(err);
    } else {
      console.log("Status tweeted sucessfully");
    }
  }
}


function convertToServerTimeZone(){

    //EST
    offset = -5.0

    clientDate = new Date();
    utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);

    serverDate = new Date(utc + (3600000*offset));
    var time = serverDate+"";
    console.log(serverDate.toLocaleString());
    return serverDate.toLocaleString()


}
//convertToServerTimeZone();
GetTemp();
setInterval(GetTemp,1000*60);
