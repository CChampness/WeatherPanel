# Weather Panel
```
This app runs in the browser to display current and forecast weather for any city that
the user requests.  The app uses two third-party APIs from *openweathermap.org*.  The
HTML and CSS are dynamically updated from JavaScript.

```

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Features
* This app uses two third-party APIs from openweathermap.org
* Current weather and the 5-day forcast are displayed.
* The *weather* API endpoint is used to obtain the latitude and longitude for the requested city.
* The *one-call-api* API endpoint is used to get all of the weather data, given the lat and lon of the requested city.
* Temperature, wind speed, relative humidity, UV index, and precipitation are displayed.
* Icons to represent the weather conditions were downloaded from *icons-for-free.com*.
* The user types in the name of the desired city to get the current weather.
* When a city has been successfully looked up, it is saved in a sub-panel of buttons for
recent searches.
* As cities are successfully looked up, their names are stored persistently in local storage.
* Whenever the app is restarted, local storage is accessed to retrieve the list of recent searches and the button panel is populated.
* Up to 8 recent cities are stored.


## Issues: bugs and potential enhancements
* The app is not able to look up a city if it is not spelled exactly correctly.
* Many smaller cities can only be looked up if the user types in its state and country.
The format has to be a certain way for the lookup to work: **City,State,Country**.  The
state and country have to be the correct 2-letter codes, and there is no way to know for sure
what it is.  Fortunately, most large cities around the world can be accessed by just the city name.
* It would be good to add the degree symbol for temperature and the percent symbol for humidity.

## Image capture of the app
The following image shows the web application's appearance and functionality:

![Demo](./Assets/images/weatherapp.png)

## Published app
https://cchampness.github.io/WeatherPanel/

