var AppID = "acafba783f22a6fd98819aec5579ae53"
var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?";
var cityApi = "https://api.openweathermap.org/data/2.5/weather?q=";
var latlon = "";
var apiURL = "";
var cityName = "";
const maxHist = 8;
var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityNameEl = document.querySelector('#cityname');
var cityContainerEl = document.querySelector('#city-container');
var citySearch = document.querySelector('#city-search');
var city5day = document.querySelector('#city-5day');
var currentDate = document.querySelector('#current-date');
var currentIcon = document.querySelector('#currentIcon');
var detailBoxEl = document.querySelector('#detail-box');
var forecastBoxEl = document.querySelector('#forecast-box');
var forecast5dayEl = document.querySelector("#forecast-5day");
var tempEl = $("#temp");
var windEl = $("#wind");
var humEl = $("#humidity");
var uviEl = $("#uvindex");
var condxEl = $("#condx");
var timeZoneEl = $("#timezone");
var cityArr = [];

function updateStorage(city) {
  cityArr = JSON.parse(localStorage.getItem("weatherList"));
  if (!cityArr) {
    cityArr = [];
  }
  if (city && !cityArr.includes(city)) {
    cityArr.unshift(city);
  }
  // Limit number of stored cities to maxHist
  while (cityArr.length > maxHist) {
    cityArr.pop();
  }
  localStorage.setItem("weatherList", JSON.stringify(cityArr));
  for(var i = 0; i < cityArr.length; i++) {
    document.querySelector("#b"+i).textContent = cityArr[i];
    document.querySelector("#b"+i).style.visibility = "visible";
  }
  // Turn off unused buttons
  for (var i=0; i < maxHist; i++) {
    if (i > cityArr.length-1) {
      document.querySelector("#b"+i).style.visibility = "hidden";
    }
  }
}

function clearPage() {
  cityNameEl.value = "";
  citySearch.textContent = "";
  currentDate.textContent = "";
  city5day.textContent = "";
  forecast5dayEl.textContent = "";
  currentIcon.textContent = "";
  tempEl.text("");
  windEl.text("");
  humEl.text("");
  uviEl.text("");
  condxEl.text("");
  timeZoneEl.text("");
  forecastBoxEl.style.visibility = "hidden";
  detailBoxEl.style.visibility = "hidden";
  for (i = 1; i <= 5; i++) {
    var weatherEl = document.querySelector("#forecast-"+i);
    var img;
    if (img = weatherEl.querySelector("img")) {
      img.remove();
    }
    document.querySelector("#forecast-"+i+" ul").style.visibility = "hidden";
  }
}

// Display all weather data for current day and 5 days ahead
function logWeatherData(data){
  forecastBoxEl.style.visibility = "visible";
  forecast5dayEl.textContent = "5-day forecast for: ";
  detailBoxEl.style.visibility = "visible";

  // Convert Kelvin to Fahrenheit
  var temp = Math.round((data.current.temp - 273.15)*9/5+32);
  tempEl.text(temp);
  windEl.text(data.current.wind_speed);
  humEl.text(data.current.humidity);
  uviEl.text(data.current.uvi);
  timeZoneEl.text(data.timezone);
  // Give a color indication for UV severity
  var uviColor;
  if (data.current.uvi < 2) {
    uviColor = "green";
  } else if (data.current.uvi < 5) {
    uviColor = "yellow";
  } else if (data.current.uvi < 7) {
    uviColor = "orange";
  } else {
    uviColor = "red";
  }
  uviEl.css("background-color", uviColor);
  condxEl.text(data.daily[0].weather[0].description);
  // Forecasts for maxHist days ahead
  var weather;
  var weatherEl;
  // Get icon for each day in forecast
  for (i = 1; i <= 5; i++) {
    weather = data.daily[i].weather[0].main;
    var icon;
    if (weather === "Clouds") {
      icon = "cloudy";
    } else if (weather === "Rain") {
      icon = "rainy";
    } else if (weather === "Snow") {
      icon = "snowy";
    } else {
      icon = "sunny";
    }
    weatherEl = document.querySelector("#forecast-"+i);
    weatherEl.insertAdjacentHTML("afterbegin",
               `<img src="./Assets/images/`+icon+`.ico" alt="`+icon+`"></img>`);
    var temp = (Math.round(data.daily[i].temp.day - 273.15)*9/5+32);
    document.querySelector("#forecast-"+i+" .date").textContent = moment().add(i,"day").format("L");
    document.querySelector("#forecast-"+i+" .temp").textContent = temp;
    document.querySelector("#forecast-"+i+" .wind").textContent = data.daily[i].wind_speed;
    document.querySelector("#forecast-"+i+" .humidity").textContent = data.daily[i].humidity;
    document.querySelector("#forecast-"+i+" ul").style.visibility = "visible";
  }
  // Get icon for current weather
  weather = data.daily[0].weather[0].main;
  var icon;
  if (weather === "Clouds") {
    icon = "cloudy";
  } else if (weather === "Rain") {
    icon = "rainy";
  } else if (weather === "Snow") {
    icon = "snowy";
  } else {
    icon = "sunny";
  }
  weatherEl = document.querySelector("#currentIcon");
  weatherEl.insertAdjacentHTML("afterbegin",
             `<img id="currentImg" src="./Assets/images/`+icon+`.ico" alt="`+icon+`">`);
}

// Use 3rd-party API to look up weather data
var getWeather = function () {
  fetch(oneCallApi+
  latlon+"&exclude=alerts,minutely&appid=" + AppID)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }
  return response.json();
  })
  .then(function (res) {
    logWeatherData(res);
  })
  .catch(function (error) {
    console.error(error);
  });
}

function buildApiURL(res) {
  var lat = res.coord.lat;
  var lon = res.coord.lon;
  latlon = "lat="+lat+"&lon="+lon;
  citySearch.textContent = res.name+", "+res.sys.country;
  currentDate.textContent = "("+moment().format("dddd MMMM Do, YYYY")+")";
  city5day.textContent = res.name;
  updateStorage(res.name);
  getWeather();
}

// Use 3rd-party API to look up latitude and logitude
var getLatLon = function() {
  forecast5dayEl.textContent = "Working...";
  var cityApiQuery = cityApi+cityName+"&appid="+AppID;
  fetch(cityApiQuery)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (res) {
    buildApiURL(res);
  })
  .catch(function (error) {
    forecast5dayEl.textContent = "";
    cityNameEl.value = "City name not found. Try City,State,Country"+
                       " Use 2 chars for State and Country";
    console.error(error);
  });
}

// Handle new city searches
var formSubmitHandler = function (event) {
  event.preventDefault();

  cityName = cityNameEl.value.trim();

  if (cityName) {
    clearPage();
    getLatLon(cityName);
    cityNameEl.value = '';
  } else {
    cityNameEl.value = "City name not found. Try City,State,Country"+
                    " Use 2 chars for State and Country";
  }
};

// Handle the recently searched cities
function btnHdlr(city) {
  clearPage();
  cityName = document.querySelector("#b"+city[4]).textContent;
  getLatLon(cityName);
}

function setupHTML() {
  // Create the history buttons for recent searches
  buttonBoxEl = document.querySelector("#city-buttons");
  for (var i = maxHist-1; i >= 0; i--) {
    buttonBoxEl.insertAdjacentHTML("afterbegin",
      `<button onclick="btnHdlr('city`+i+`')" id='b`+i+`' class="btn"></button>`);
  }

  // Write HTML to create the forecast blocks
  forecastEl = document.querySelector("#forecast-box");
  for (var i = 5; i >= 1; i--) {
    forecastEl.insertAdjacentHTML("afterbegin",
     `<div id="forecast-`+i+`" class="card">
        <ul>
          <li>Date:<span class="date"></span></li>
          <li>Temp:<span class="temp"></span></li>
          <li>Wind speed:<span class="wind"></span></li>
          <li>Humidity:<span class="humidity"></span></li>
        </ul>
      </div>`);
  }
}

// Processing starts here
setupHTML();
clearPage();
updateStorage();
cityFormEl.addEventListener('submit', formSubmitHandler);
