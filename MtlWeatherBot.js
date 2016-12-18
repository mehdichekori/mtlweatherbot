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
var windSpeed;

//makes an an api call to the openweathermap api to get data about montreals weather
GetData = function(){
  request({
    url:url,
    json: true,
  }, function (error,response,body){
    //if there is no error and the response.statuscode is 200 (success)
    if(!error && response.statusCode === 200){
      //sets the variables equal to the fetched data
      currentTemp = body.main.temp;
      tempMin = body.main.temp_min;
      tempMax = body.main.temp_max;
      humidity = body.main.humidity;
      weatherDescription = body.weather[0].description;
      windSpeed = body.wind.speed;

      console.log("Currently " + weatherDescription + " at " + currentTemp + "°C" + ", forcast: Min " + tempMin + "°C " + "& a Max of " + tempMax + "°C with " + humidity + "% Humidity" + " and "+windSpeed+"m/s Wind");

      useData();
    }
    if(error){
      console.log("Errog Triggered in GetTemp function.");
      console.log(error);
    }
  })
}

//uses the data that we fetched in getData()
//then itconverts the windpseed to km/h
//then it calls the function to tweet the data
//if the current temp is different from the last one tweeted
function useData(){
  if(currentTemp != lastTemp){
    windSpeed = convertWindSpeed(windSpeed);
      TweetTemp();
      console.log("The temperature has changed, tweeted the new value:");
  }else{
    console.log("The temperature hasn't changed since the last tweet waiting before sending another tweet.");
  }
}

//converts windspeed from m/s to km/h
function convertWindSpeed(speedMS){
  var speedkmh = ((speedMS * 20) / 5);
  return speedkmh;
}

//Uses Twitt object to post a tweet
function TweetTemp(){
  //construct the tweet
  var tweet = {
    status: "Currently " + weatherDescription + " at " + currentTemp + "°C" + ", forcast: Min " + tempMin + "°C " + "& a Max of " + tempMax + "°C with " + humidity + "% Humidity and " + windSpeed +"km/h winds. #montreal #montrealweather"
  }
  //posting the tweet, with a callback function tweeted
  T.post('statuses/update',tweet,tweeted);

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

GetData();
setInterval(GetData,1000*60); //calls the getData function once every minute
