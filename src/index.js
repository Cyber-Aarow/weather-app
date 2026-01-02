import './main.css';

//Left
const cityName = document.querySelector('#city-name');
const symbol = document.querySelector('#symbol-holder'); //Change
//Mid
const currentTemp = document.querySelector('#current-temp');
const conditions = document.querySelector('#conditions');
const high = document.querySelector('#high');
const low = document.querySelector('#low');
//Right
const feelsLike = document.querySelector('#feels-like');
const humidity = document.querySelector('#humidity');
const chanceOfRain = document.querySelector('#chance-of-rain');
const uvIndex = document.querySelector('#UV-index');

let location = 'sanfrancisco';

async function getWeather(location){
    try {
        const weather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=29GQTWHF9EU6UHLVPZKEFH43C`); //public key; no need to hide for this assignment
        const weatherData = await weather.json();
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.log(error);
    }
}

async function updateWeather(){
    try {
        const weather = await getWeather(location);
        displayWeather(weather);
    } catch (error) {
        alert(error);
    }
}



function displayCityName(weather){
    cityName.textContent = weather.resolvedAddress.split(',')[0]; //Make into array of 3; pull 0
}

function displayCurrentTemp(weather){
    currentTemp.textContent = weather.currentConditions.temp;
}

function  displayConditions(weather){
    conditions.textContent = weather.currentConditions.conditions;
}

function displayHigh(weather){
    high.textContent = weather.days[0].tempmax;
}

function displayLow(weather){
    low.textContent = weather.days[0].tempmin;
}

function displayFeelsLike(weather){
    feelsLike.textContent = weather.currentConditions.feelslike;
}

function displayHumidity(weather){
    humidity.textContent = weather.currentConditions.humidity;
}

function displayChanceOfRain(weather){
    chanceOfRain.textContent = weather.currentConditions.precipprob;
}

function displayUVIndex(weather){
    uvIndex.textContent = weather.currentConditions.uvindex;
}

function displayWeather(weather){
    displayCityName(weather);

    displayCurrentTemp(weather);
    displayConditions(weather);
    displayHigh(weather);
    displayLow(weather);

    displayFeelsLike(weather);
    displayHumidity(weather);
    displayChanceOfRain(weather);
    displayUVIndex(weather);
}

updateWeather();