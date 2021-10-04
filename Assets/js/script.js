var AppID = "acafba783f22a6fd98819aec5579ae53"
var latlon = "";
var apiURL = "";
var cityName = "";

var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityNameEl = document.querySelector('#cityname');
var cityContainerEl = document.querySelector('#city-container');
var citySearch = document.querySelector('#city-search');

var cityArr = [];

var tempEl = $("#temp");
var windEl = $("#wind");
var humEl = $("#humidity");
var uviEl = $("#uvindex");

function updateStorage(city) {
  cityArr = JSON.parse(localStorage.getItem("weatherList"));
  if (!cityArr) {
    cityArr = [];
  }
  if (!cityArr.includes(city)) {
    cityArr.unshift(city);
  }
  localStorage.setItem("weatherList", JSON.stringify(cityArr));
  for(i = 0; i < cityArr.length; i++) {
    
  }
}

function logWeatherData(data){
  console.log(data);
  // Convert Kelvin to Fahrenheit
  var temp = Math.round((data.current.temp - 273.15)*9/5+32);
  tempEl.text(temp);
  windEl.text(data.current.wind_speed);
  humEl.text(data.current.humidity);
  uviEl.text(data.current.uvi);
  // Forecasts for 5 days ahead
  for (i = 1; i <= 5; i++) {
    var weather = data.daily[i].weather[0].main;
    console.log("weather:"+weather);
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
    var weatherEl = document.querySelector("#forecast-"+i);
    weatherEl.insertAdjacentHTML("afterbegin",
               `<img src="./Assets/images/`+icon+`.ico" alt="`+icon+`"></img>`);
    console.log(`<img src="./Assets/images/`+icon+`.ico" alt="`+icon+`"></img>`);
    var temp = (Math.round(data.daily[i].temp.day - 273.15)*9/5+32);
    console.log(temp,
                data.daily[i].wind_speed,
                data.daily[i].humidity);
    document.querySelector("#forecast-"+i+" .date").textContent = moment().add(i,"day").format("L");
    document.querySelector("#forecast-"+i+" .temp").textContent = temp;
    document.querySelector("#forecast-"+i+" .wind").textContent = data.daily[i].wind_speed;
    document.querySelector("#forecast-"+i+" .humidity").textContent = data.daily[i].humidity;
  }
}

var getWeather = function () {
  console.log("Fetching, I promise...");
  console.log("in getWeather, apiURL:"+apiURL);
  fetch("https://api.openweathermap.org/data/2.5/onecall?"+
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
  apiURL = "https://api.openweathermap.org/data/2.5/onecall?"+
  latlon+"&exclude=alerts,minutely&appid=" + AppID;
  console.log("buildApiURL...apiURL"+apiURL);
  citySearch.textContent = res.name+", "+res.sys.country+" ("+
                 moment().format("dddd MMMM Do, YYYY")+")";
  updateStorage(res.name);
  getWeather();
}

var getLatLon = function() {
    console.log("Fetching, I promise...");
    console.log("cityName:"+cityName);
  var cityApiQuery = "https://api.openweathermap.org/data/2.5/weather?q="+
                     cityName+"&appid="+AppID;
  fetch(cityApiQuery)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (res) {
    console.log(res);
    buildApiURL(res);
  })
  .catch(function (error) {
    cityNameEl.value = "City name not found. Try City,State,Country";
    console.error(error);
  });
}

var formSubmitHandler = function (event) {
  event.preventDefault();

  cityName = cityNameEl.value.trim();
  // citySearch.textContent = cityName
console.log(cityName);

  if (cityName) {
    getLatLon(cityName);
    cityNameEl.value = '';
  } else {
    cityNameEl.value = "City name not found. Try City,State,Country";
  }
};

var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('data-city');

  if (city) {
    getFeaturedRepos(city);

    cityContainerEl.textContent = '';
  }
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    cityContainerEl.textContent = 'No cities found.';
    return;
  }

  citySearch.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    // var repoName = repos[i].owner.login + '/' + repos[i].name;

    // var repoEl = document.createElement('a');
    // repoEl.classList = 'list-item flex-row justify-space-between align-center';
    // repoEl.setAttribute('href', './single-repo.html');

    // var titleEl = document.createElement('span');
    // titleEl.textContent = repoName;

    // repoEl.appendChild(titleEl);

    // var statusEl = document.createElement('span');
    // statusEl.classList = 'flex-row align-center';

    // if (repos[i].open_issues_count > 0) {
    //   statusEl.innerHTML =
    //     "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    // } else {
    //   statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    // }

    // repoEl.appendChild(statusEl);

    // repoContainerEl.appendChild(repoEl);
  }
};

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
