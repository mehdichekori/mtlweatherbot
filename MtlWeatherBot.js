var request = require('request');
var Twit = require('twit')
var config = require('./config');
var url = 'http://api.openweathermap.org/data/2.5/weather?q=Montreal&APPID=8b5d20a4d6441d9fab48bd8bda62ebc4&units=metric';
var T = new Twit(config);
var lastTemp;
var currentTemp;
var tempMin;
var tempMax;
var pressure;
var weatherDescription;
var windspeed;

GetData = function(){
  request({
    url:url,
    json: true,
  }, function (error,response,body){
    if(!error && response.statusCode === 200){
      currentTemp = body.main.temp;
      tempMin = body.main.temp_min;
      tempMax = body.main.temp_max;
      humidity = body.main.humidity;
      weatherDescription = body.weather[0].description;
      windspeed = body.wind.speed;

      console.log("Currently " + weatherDescription + " at " + currentTemp + "°C" + ", forcast: Min " + tempMin + "°C " + "& a Max of " + tempMax + "°C with " + humidity + "% Humidity" + " and "+windspeed+"m/s Wind");
      useData();
    }
    if(error){
      console.log("Errog Triggered in GetTemp function.");
      console.log(error);
    }
  })
}

function TweetTemp(){
  //time = convertToServerTimeZone();

  var tweet = {
    status: "Currently " + weatherDescription + " at " + currentTemp + "°C" + ", forcast: Min " + tempMin + "°C " + "& a Max of " + tempMax + "°C with " + humidity + "% Humidity and " + windspeed +"km/h winds. #montreal #montrealweather"
  }

  T.post('statuses/update',tweet,tweeted); //add check if currenttemp has load

  function tweeted(err,data,response){
    if(err){
      console.log("Error Triggered in Tweeted Function.");
      console.log(err);
    } else {
      lastTemp = currentTemp;
      console.log("Status tweeted sucessfully.");
    }
  }
}


// function convertToServerTimeZone(){
//     //EST
//     offset = -5.0
//     clientDate = new Date();
//     utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
//     serverDate = new Date(utc + (3600000*offset));
//     var time = serverDate+"";
//     console.log(serverDate.toLocaleString());
//     return serverDate.toLocaleString()
// }

//converts windspeed from m/s to km/h
function convertWindSpeed(speedMS){
  var speedkmh = ((speedMS * 20) / 5);
  return speedkmh;
}
//uses teh data that we fetched,
//converts the windpseed to km/h
//and calls the function to tweet the data
//if the current temp is different from the last one tweeted
function useData(){
  if(currentTemp != lastTemp){
    windspeed = convertWindSpeed(windspeed);
      TweetTemp();
      console.log("The temperature has changed, tweeted the new value:");
  }else{
    console.log("The temperature hasn't changed since the last tweet waiting before sending another tweet.");
  }
}
GetData();
setInterval(GetData,1000*60); //calls the getData function once every minute
