var AppID = "acafba783f22a6fd98819aec5579ae53"
var latlon = "lat=34.5773206&lon=-83.3323851";
var apiURL = "https://api.openweathermap.org/data/2.5/onecall?"+latlon+"&exclude=alerts,minutely&appid=" + AppID;

function logData(data){
  console.log(data);
  // console.log(data.ok);
  // console.log(data.current);
  console.log(data.current.temp);
  console.log(data.current.uvi);
  console.log(data.current.humidity);
  console.log(data.current.wind_speed);

}

// var getWeather = function () {
//   fetch(apiURL)
//   .then(function (response) {
//     if (response.ok) {
//       console.log("response: "+response);
//       response.json().then(function (data) {
//         console.log("data: "+data);
//         logData(data);
//     });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   })
//   .catch(function (error) {
//     alert('Unable to connect to '+apiURL);
//   });
// };

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

var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a GitHub username');
  }
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = '';
  }
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
