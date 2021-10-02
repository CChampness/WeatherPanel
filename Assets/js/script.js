var AppID = "acafba783f22a6fd98819aec5579ae53"
var latlon = "lat=34.5773206&lon=-83.3323851";
var apiURL = "https://api.openweathermap.org/data/2.5/onecall?"+
             latlon+"&exclude=alerts,minutely&appid=" + AppID;

var tempEl = $("#temp");
var windEl = $("#wind");
var humEl = $("#humidity");
var uviEl = $("#uvindex");


function logData(data){
  console.log(data);
  // console.log(data.ok);
  // console.log(data.current);
  console.log(data.current.temp);
  console.log(data.current.uvi);
  console.log(data.current.humidity);
  console.log(data.current.wind_speed);
  // Convert Kelvin to Fahrenheit
  var temp = Math.round((data.current.temp - 273.15)*9/5+32);
  tempEl.text(temp);
  windEl.text(data.current.wind_speed);
  humEl.text(data.current.humidity);
  uviEl.text(data.current.uvi);
}

var getWeather = function () {
  console.log("Fetching, I promise...");
  fetch(apiURL)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (res) {
    logData(res);
  })
  .catch(function (error) {
    console.error(error);
  });
}

getWeather();

getLatLon(cityName) {
  var cityApiQuery = "api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+AppID;
    console.log("Fetching, I promise...");
  fetch(apiURL)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (res) {
    logData(res);
  })
  .catch(function (error) {
    console.error(error);
  });
}


var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityNameEl = document.querySelector('#cityname');
var cityContainerEl = document.querySelector('#city-container');
var citySearchTerm = document.querySelector('#city-search-term');

function getCity(cityName) {
  citySearchTerm.textContent = cityName;
}

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = cityNameEl.value.trim();
console.log(cityName);
  if (cityName) {
    getCity(cityName);
    getLatLon(cityName);

    cityNameEl.textContent = '';
    cityNameEl.value = '';
  } else {
    alert('City name not found');
  }
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    cityContainerEl.textContent = '';
  }
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    cityContainerEl.textContent = 'No cities found.';
    return;
  }

  citySearchTerm.textContent = searchTerm;

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
