import './main.css';

//Left
const cityName = document.querySelector('#city-name');
const icon = document.querySelector('#main-icon');
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

//Search
const searchButton = document.querySelector('#search-button');
const searchBar = document.querySelector('#search-bar');

let location = 'sanfrancisco';
updateWeather();

searchButton.addEventListener('click', (e)=>{
    e.preventDefault();
    search();
    updateWeather();
});

//Search function
function search(){
    let temp = location;
    try {
        location = searchBar.value.toLowerCase().replaceAll(" ", '');
        searchBar.value = "";
    } catch (error) {
        
    }
}

//The two big ones
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

//All the small ones for easier readability and debugging
function displayCityName(weather){
    let city = weather.resolvedAddress.split(',')[0]; //Make into array of 3; pull 0 (the city name)
    cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1); //Make the first letter capital (1-word cities were appearing lowercase)
}

async function displayIcon(weather){
    try {
        const icon_name = weather.currentConditions.icon;
        const {default: icon_location} = await import(
            `./icons/${icon_name}.svg`
        );
        icon.src = await icon_location;
        icon.alt = icon_name;
    } catch (error) {
        alert(error);
    }   
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

//Conglomeration of the small ones
function displayWeather(weather){
    displayCityName(weather);
    displayIcon(weather);

    displayCurrentTemp(weather);
    displayConditions(weather);
    displayHigh(weather);
    displayLow(weather);

    displayFeelsLike(weather);
    displayHumidity(weather);
    displayChanceOfRain(weather);
    displayUVIndex(weather);
}