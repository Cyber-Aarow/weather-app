import './main.css';

//Left
const cityName = document.querySelector('#city-name');
const mainIcon = document.querySelector('#main-icon');
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

async function displayIcon(iconElement, iconName){
    try {
        const {default: iconLocation} = await import(
            `./icons/${iconName}.svg`
        );
        iconElement.src = await iconLocation;
        iconElement.alt = iconName;
    } catch (error) {
        alert(error);
    }
}

async function displayMainIcon(weather){
    try {
        const iconName = weather.currentConditions.icon;
        displayIcon(mainIcon, iconName);
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

//Hours
function arrayMapNextHours(weather){
    const now = weather.currentConditions.datetimeEpoch;
    const nextHours = weather.days
    .flatMap(day => day.hours)
    .filter(hour => hour.datetimeEpoch > now)
    .slice(0,7);

    return nextHours;
}

function discernTime(hour){
    let pm = false;
    const num_string = hour.datetime.slice(0,2);
    let num = Number(num_string);

    if(num > 12){
        num = num - 12;
        pm = true;
    }
    
    let time = num + ':00 ';
    if(pm){
        time += 'pm';
    } 
    else{
        time += 'am';
    }
    return time;
}

function updateHourCard(hourElement, hour){
    const time = hourElement.querySelector('.time');
    const icon = hourElement.querySelector('img');
    const temperature = hourElement.querySelector('.temperature');

    time.textContent = discernTime(hour);
    icon.src = displayIcon(icon, hour.icon);
    temperature.textContent = hour.temp;
}

function displayNextHours(weather){
    const nextHours = arrayMapNextHours(weather);
    const hourElements = document.querySelectorAll('.hour');

    nextHours.forEach((hour, i) => {
        const hourCard = hourElements[i];
        updateHourCard(hourCard, hour);
    });
}

//Days
function arrayMapNextWeek(weather){
    return weather.days.slice(1,8);
}

function discernDay(day, timezone){
    return new Date(day.datetimeEpoch * 1000)
    .toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: timezone
    });
}

function updateDayCard(dayElement, day, timezone){
    const weekday = dayElement.querySelector('.weekday');
    const icon = dayElement.querySelector('img');
    const temperature = dayElement.querySelector('.temperature');

    weekday.textContent = discernDay(day, timezone);
    icon.src = displayIcon(icon, day.icon);
    temperature.textContent = day.tempmax;
}

function displayNextWeek(weather){
    const nextWeek = arrayMapNextWeek(weather);
    const dayElements = document.querySelectorAll('.day');

    nextWeek.forEach((day, i) => {
        const dayCard = dayElements[i];
        updateDayCard(dayCard, day, weather.timezone);
    });
}

//Conglomeration of the small ones
function displayWeather(weather){
    displayCityName(weather);
    displayMainIcon(weather);

    displayCurrentTemp(weather);
    displayConditions(weather);
    displayHigh(weather);
    displayLow(weather);

    displayFeelsLike(weather);
    displayHumidity(weather);
    displayChanceOfRain(weather);
    displayUVIndex(weather);

    displayNextHours(weather);
    displayNextWeek(weather);
}